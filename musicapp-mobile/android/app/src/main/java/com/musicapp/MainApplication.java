package com.musicapp;

import android.app.Application;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.support.multidex.MultiDex;
import android.util.Base64;
import android.util.Log;

import com.dylanvann.fastimage.FastImageViewPackage;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import com.goldenowl.twittersignin.TwitterSigninPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;

import iyegoroff.RNTextGradient.RNTextGradientPackage;

import io.invertase.firebase.RNFirebasePackage;

import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.guichaguri.trackplayer.TrackPlayer;
import com.oblador.vectoricons.VectorIconsPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.List;

import co.apptailor.googlesignin.RNGoogleSigninPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;

public class MainApplication extends Application implements ReactApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new CookieManagerPackage(),
                    new RNCWebViewPackage(),
                    new RNTextGradientPackage(),
                    new RNFirebasePackage(),
                    new RNFirebaseAnalyticsPackage(),
                    new PickerPackage(),
                    new FBSDKPackage(mCallbackManager),
                    new LinearGradientPackage(),
                    new OrientationPackage(),
                    new TrackPlayer(),
                    new VectorIconsPackage(),
                    new KCKeepAwakePackage(),
                    new ReactVideoPackage(),
                    new RNGestureHandlerPackage(),
                    new FastImageViewPackage(),
                    new TwitterSigninPackage(),
                    new RNGoogleSigninPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        MultiDex.install(this);
        AppEventsLogger.activateApp(this);
        printHashKey();
    }

    void printHashKey() {
        try {
            PackageInfo info = getPackageManager().getPackageInfo(getPackageName(), PackageManager.GET_SIGNATURES);
            for (Signature signature : info.signatures) {
                MessageDigest md = MessageDigest.getInstance("SHA");
                md.update(signature.toByteArray());
                String hashKey = new String(Base64.encode(md.digest(), 0));
                Log.i("printHashKey", "printHashKey() Hash Key --------> " + hashKey);
            }
        } catch (NoSuchAlgorithmException e) {
            Log.e("printHashKey", "printHashKey()", e);
        } catch (Exception e) {
            Log.e("printHashKey", "printHashKey()", e);
        }
    }
}
