#!/bin/bash
# ==============================================================================
# Custom Override Check Script
# ==============================================================================
# Description:
#   This script checks custom override files for consistency with the base files.
#   It verifies that:
#   1. All custom override files have corresponding base files
#   2. Custom override files content matches with base files (if applicable)
#
# Usage:
#   ./check-custom-overrides.sh [--verbose]
#
# Options:
#   --verbose    Show detailed processing information for each file
#
# Directories Checked:
#   - fishmeet/css/    Custom CSS overrides
#   - fishmeet/react/  Custom React component overrides
#
# Exit Codes:
#   0  All checks passed - no missing or inconsistent files
#   1  Some checks failed - missing or inconsistent files found
#
# ==============================================================================

# Exit on error, unset variable, or pipe failure
set -euo pipefail

# Get script directory and ensure we're working from project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ==============================================================================
# ANSI Color Codes for Output Formatting
# ==============================================================================
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'  # No Color

# ==============================================================================
# Global Variables for Statistics
# ==============================================================================
TOTAL_FILES=0
MISSING_FILES=0
INCONSISTENT_FILES=0
SKIPPED_FILES=0
VERBOSE=false

# ==============================================================================
# Utility Functions
# ==============================================================================

# Generate timestamp for log messages
timestamp() {
    date "+%Y-%m-%d %H:%M:%S"
}

# Log informational messages (always shown)
log_info() {
    echo -e "[$(timestamp)] ${BLUE}[INFO]${NC} $1"
}

# Log verbose messages (only shown when --verbose flag is used)
log_verbose() {
    if [ "$VERBOSE" = true ]; then
        echo -e "[$(timestamp)] ${BLUE}[INFO]${NC} $1"
    fi
}

# Log warning messages (always shown)
log_warning() {
    echo -e "[$(timestamp)] ${YELLOW}[WARNING]${NC} $1"
}

# Log error messages (always shown)
log_error() {
    echo -e "[$(timestamp)] ${RED}[ERROR]${NC} $1"
}

# Log success messages (always shown)
log_success() {
    echo -e "[$(timestamp)] ${GREEN}[SUCCESS]${NC} $1"
}

# ==============================================================================
# File Type Detection Functions
# ==============================================================================

# Check if a file is binary (not suitable for text-based diff)
# Returns 0 (true) if binary, 1 (false) if text
is_binary_file() {
    local file="$1"

    # Check if file is readable first
    if ! [ -r "$file" ]; then
        return 1
    fi

    # Check by file extension first (faster)
    local ext="${file##*.}"
    case "$ext" in
        png|jpg|jpeg|gif|bmp|ico|pdf|zip|tar|gz|bz2)
            return 0
            ;;
    esac

    # Use 'file' command to detect text files (if available)
    if command -v file >/dev/null 2>&1; then
        if file "$file" 2>/dev/null | grep -q "text\|empty" 2>/dev/null; then
            return 1
        fi
    fi

    # Default to treating as text if we can't determine
    return 1
}

# Check if a file is a symbolic link
# Returns 0 (true) if symlink, 1 (false) otherwise
is_symlink() {
    local file="$1"
    [ -L "$file" ]
}

# ==============================================================================
# Directory and File Processing Functions
# ==============================================================================

# Verify a directory exists before processing
# Returns 0 if exists, 1 if not
check_directory_exists() {
    local dir="$1"
    if [ ! -d "$dir" ]; then
        log_error "Directory does not exist: $dir"
        return 1
    fi
    log_verbose "Checking directory: $dir"
    return 0
}

# Process a single custom override file and check against target file
process_file() {
    local custom_file="$1"
    ((TOTAL_FILES++))

    # Remove the 'fishmeet/' prefix to get the target file path
    local custom_path_relative="$custom_file"
    local target_path="${custom_path_relative#fishmeet/}"

    log_verbose "Processing: $custom_file -> $target_path"

    # Skip symbolic links
    if is_symlink "$custom_file"; then
        log_warning "Skipping symlink: $custom_file"
        ((SKIPPED_FILES++))
        return 0
    fi

    # Skip unreadable files
    if ! [ -r "$custom_file" ]; then
        log_error "Permission denied: cannot read $custom_file"
        ((SKIPPED_FILES++))
        return 0
    fi

    # Check if target file exists
    if [ ! -e "$target_path" ]; then
        log_warning "Target file missing - Custom: $custom_file, Target: $target_path"
        ((MISSING_FILES++))
        return 0
    fi

    # Skip binary files (no text-based diff possible)
    if is_binary_file "$custom_file" || is_binary_file "$target_path"; then
        log_warning "Skipping binary file - Custom: $custom_file, Target: $target_path"
        ((SKIPPED_FILES++))
        return 0
    fi

    # Compare file contents and show diff if they differ
    if ! diff -q "$custom_file" "$target_path" >/dev/null 2>&1; then
        log_warning "File content mismatch - Custom: $custom_file, Target: $target_path"
        echo "--- DIFF START ---"
        diff -u "$target_path" "$custom_file" 2>/dev/null | head -50 || true
        echo "--- DIFF END ---"
        ((INCONSISTENT_FILES++))
    fi
    return 0
}

# Recursively process all files in a directory
process_directory() {
    local dir="$1"
    if ! check_directory_exists "$dir"; then
        return 1
    fi

    # Use null-terminated filenames to handle special characters safely
    while IFS= read -r -d '' file; do
        if [ -f "$file" ]; then
            process_file "$file" || true  # Continue even if one file fails
        fi
    done < <(find "$dir" -type f -print0 2>/dev/null)

    return 0
}

# ==============================================================================
# Summary and Output Functions
# ==============================================================================

# Print final summary of check results
print_summary() {
    echo ""
    echo "========================================"
    echo "          CHECK SUMMARY"
    echo "========================================"
    log_info "Total files checked: $TOTAL_FILES"
    log_info "Skipped files: $SKIPPED_FILES"
    if [ $MISSING_FILES -gt 0 ]; then
        log_warning "Missing files: $MISSING_FILES"
    else
        log_success "Missing files: $MISSING_FILES"
    fi
    if [ $INCONSISTENT_FILES -gt 0 ]; then
        log_warning "Inconsistent files: $INCONSISTENT_FILES"
    else
        log_success "Inconsistent files: $INCONSISTENT_FILES"
    fi
    echo "========================================"
    echo ""

    # Return 1 if there are issues, 0 otherwise
    if [ $MISSING_FILES -gt 0 ] || [ $INCONSISTENT_FILES -gt 0 ]; then
        return 1
    fi
    return 0
}

# ==============================================================================
# Main Execution
# ==============================================================================

main() {
    # Parse command line arguments
    while [ $# -gt 0 ]; do
        case "$1" in
            --verbose)
                VERBOSE=true
                shift
                ;;
            *)
                log_error "Unknown argument: $1"
                echo "Usage: $0 [--verbose]"
                exit 1
                ;;
        esac
    done

    log_info "Starting custom override check..."

    # Process both custom override directories
    process_directory "fishmeet/css"
    process_directory "fishmeet/react"

    # Print summary and determine exit code
    print_summary
    local exit_code=$?

    # Final status message
    if [ $exit_code -eq 0 ]; then
        log_success "All checks passed!"
    else
        log_error "Some checks failed!"
    fi

    exit $exit_code
}

# Start the script with command line arguments
main "$@"
