# MusicApp-Mobile

MusicApp Mobile


# Setup
   ```
   cd Desktop
   git clone REPO_URL
   cd MusicApp-Mobile
   npm install
   cd ios && pod install && cd ..
   react-native run-ios
   ```
# Node module change
* for use of text gradient run command after npm install
```
node node_modules/react-native-text-gradient/patch-rn.js
```

* change react-native-af-video-player duration text font-family manual from react-native-af-video-player/Component/Time.js file

* remove folder react-native inside react-native-twitter-signin/node_modules

* add code for get audio ducking event for ios

    **Github commit URL**

    https://github.com/react-native-kit/react-native-track-player/pull/530/commits/c8785963f7c42685eee54016ee9b7dde329c3a78

    **Local file change code**

   +  node_modules/react-native-track-player/ios/RNTrackPlayer/RNTrackPlayer.swift

    ```  
        "remote-stop",
        "remote-pause",
        "remote-play",
      + "remote-duck",
        "remote-next",
        "remote-seek",
        "remote-previous",	
    ```
    ```
     func setupInterruptionHandling() {
        let notificationCenter = NotificationCenter.default
        notificationCenter.removeObserver(self)
        notificationCenter.addObserver(self,
                                       selector: #selector(handleInterruption),
                                       name: AVAudioSession.interruptionNotification,
                                       object: nil)
    }


     @objc func handleInterruption(notification: Notification) {
        guard let userInfo = notification.userInfo,
            let typeValue = userInfo[AVAudioSessionInterruptionTypeKey] as? UInt,
            let type = AVAudioSession.InterruptionType(rawValue: typeValue) else {
                return
        }
        if type == .began {
            // Interruption began, take appropriate actions
            self.sendEvent(withName: "remote-duck", body: [
                "ducking": true,
                "paused": true
                ])
        }
        else if type == .ended {
            if let optionsValue = userInfo[AVAudioSessionInterruptionOptionKey] as? UInt {
                let options = AVAudioSession.InterruptionOptions(rawValue: optionsValue)
                if options.contains(.shouldResume) {
                    // Interruption Ended - playback should resume
                    self.sendEvent(withName: "remote-duck", body: [
                        "ducking": false,
                        "paused": false
                        ])
                } else {
                    // Interruption Ended - playback should NOT resume
                    self.sendEvent(withName: "remote-duck", body: [
                        "permanent": true
                        ])
                }
            }
        }
    }
    ```

    ```
    @objc(setupPlayer:resolver:rejecter:)
    public func setupPlayer(config: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {	  
       
       + setupInterruptionHandling();

         // configure if player waits to pl
        let autoWait: Bool = config["waitForBuffer"] as? Bool ?? false
    ```

    +  node_modules/react-native-track-player/lib/index.js
    
    ```
        'remote-jump-forward',
        'remote-jump-backward',
        'remote-seek',
       +'remote-duck',
       
      ];

        if (Platform.OS === 'android') {
        events.push('remote-skip', 'remote-duck', 'remote-set-rating', 'remote-play-id', 'remote-play-search');

    ```

# Make sure before release
* check base url

* remove all static pre written value from EditText / TextInput

* change iOS and Android build number

* create latest bundle for android (every time)

    ```
    mkdir -p android/app/src/main/assets && rm -rf android/app/build && react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res && cd android && ./gradlew assembleDebug
    ```

* if you get error while create Release apk ... remove all image from drawable folder. do it for all drawable folder

* create new release apk for android