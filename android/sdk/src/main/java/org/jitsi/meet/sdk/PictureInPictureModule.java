/*
 * Copyright @ 2017-present 8x8, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.jitsi.meet.sdk;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.PictureInPictureParams;
import android.os.Build;
import android.util.Rational;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import com.facebook.react.bridge.LifecycleEventListener;
import org.jitsi.meet.sdk.log.JitsiMeetLogger;

import java.util.HashMap;
import java.util.Map;

import static android.content.Context.ACTIVITY_SERVICE;

@ReactModule(name = PictureInPictureModule.NAME)
class PictureInPictureModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    public static final String NAME = "PictureInPicture";
    private static final String TAG = NAME;

    private static boolean isSupported;
    private boolean isEnabled;

    public PictureInPictureModule(ReactApplicationContext reactContext) {
        super(reactContext);

        ActivityManager am = (ActivityManager) reactContext.getSystemService(ACTIVITY_SERVICE);

        // Android Go devices don't support PiP. There doesn't seem to be a better way to detect it than
        // to use ActivityManager.isLowRamDevice().
        // https://stackoverflow.com/questions/58340558/how-to-detect-android-go
        isSupported = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && !am.isLowRamDevice();
        reactContext.addLifecycleEventListener(this);
    }

    /**
     * Gets a {@code Map} of constants this module exports to JS. Supports JSON
     * types.
     *
     * @return a {@link Map} of constants this module exports to JS
     */
    @Override
    public Map<String, Object> getConstants() {
        Map<String, Object> constants = new HashMap<>();
        constants.put("SUPPORTED", isSupported);
        return constants;
    }

    /**
     * Enters Picture-in-Picture (mode) for the current {@link Activity}.
     * Supported on Android API >= 26 (Oreo) only.
     *
     * @throws IllegalStateException if {@link #isPictureInPictureSupported()}
     * returns {@code false} or if {@link #getCurrentActivity()} returns
     * {@code null}.
     * @throws RuntimeException if
     * {@link Activity#enterPictureInPictureMode(PictureInPictureParams)} fails.
     * That method can also throw a {@link RuntimeException} in various cases,
     * including when the activity is not visible (paused or stopped), if the
     * screen is locked or if the user has an activity pinned.
     */
    @TargetApi(Build.VERSION_CODES.O)
    public void enterPictureInPicture() {
        if (!isEnabled) {
            return;
        }

        if (!isSupported) {
            throw new IllegalStateException("Picture-in-Picture not supported");
        }

        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            throw new IllegalStateException("No current Activity!");
        }

        if (currentActivity.isInPictureInPictureMode()) {
            return;
        }

        JitsiMeetLogger.i(TAG + " Entering Picture-in-Picture");

        PictureInPictureParams.Builder builder
            = new PictureInPictureParams.Builder()
            .setAspectRatio(new Rational(9, 16));

        // https://developer.android.com/reference/android/app/Activity.html#enterPictureInPictureMode(android.app.PictureInPictureParams)
        //
        // The system may disallow entering picture-in-picture in various cases,
        // including when the activity is not visible, if the screen is locked
        // or if the user has an activity pinned.
        if (!currentActivity.enterPictureInPictureMode(builder.build())) {
            throw new RuntimeException("Failed to enter Picture-in-Picture");
        }
    }

    /**
     * Enters Picture-in-Picture (mode) for the current {@link Activity}.
     * Supported on Android API >= 26 (Oreo) only.
     *
     * @param promise a {@code Promise} which will resolve with a {@code null}
     * value upon success, and an {@link Exception} otherwise.
     */
    @ReactMethod
    public void enterPictureInPicture(Promise promise) {
        try {
            enterPictureInPicture();
            promise.resolve(null);
        } catch (RuntimeException re) {
            promise.reject(re);
        }
    }

    @ReactMethod
    public void setPictureInPictureEnabled(Boolean enabled) {
        this.isEnabled = enabled;
    }

    public boolean isPictureInPictureSupported() {
        return isSupported;
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {
        /**
         * Add by Ranger:
         * When this method is executed, it is currently difficult to determine whether it is caused by a system pop-up box or manually by the user.
         * 1. When the system pop-up box pops up: 
         * If you execute enterPictureInPicture(); some Android systems will report an error. So use try catch for now.
        
         * 2.Officially recommended
         * https://developer.android.com/develop/ui/views/picture-in-picture#java
         * Must be rewritten:
         * @Override:
         * onUserLeaveHint()
         * However, the RN project only has one MainActivity, which requires scripts to inject code and communicate with the current module. 
         * The code is too intrusive, so we do not do this currently.
         */
        try {
            enterPictureInPicture();
        } catch (Exception e) {
            JitsiMeetLogger.e(TAG + " Error entering PiP mode on pause: ", e);
        }
    }

    @Override
    public void onHostDestroy() {

    }
}


