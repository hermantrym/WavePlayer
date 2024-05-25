import React, { useRef, useState } from "react"
import { SafeAreaView, StyleSheet, View, Button } from "react-native"
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from "react-native-audio-recorder-player"

import { useAudioPlayer } from "./lib/@simform-solutions/react-native-audio-waveform/src/hooks"
import RNFetchBlob from "rn-fetch-blob"
import {
  IWaveformRef,
  Waveform,
} from "./lib/@simform-solutions/react-native-audio-waveform"
import {
  IPreparePlayer,
  ISeekPlayer,
} from "./lib/@simform-solutions/react-native-audio-waveform/lib/types/AudioWaveformTypes"

const audioRecorderPlayer = new AudioRecorderPlayer()

function App() {
  const waveformRef = useRef<IWaveformRef>(null)
  const [audioPath, setAudioPath] = useState<string | null>(null)
  const {
    playPlayer,
    pausePlayer,
    stopPlayer,
    seekToPlayer,
    setVolume,
    preparePlayer,
  } = useAudioPlayer()

  const startRecording = async () => {
    const dirs = RNFetchBlob.fs.dirs
    const path = `${dirs.CacheDir}/test.m4a`
    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    }
    const uri = await audioRecorderPlayer.startRecorder(path, audioSet)
    audioRecorderPlayer.addRecordBackListener((e) => {
      console.log("Recording: ", e.currentPosition)
    })
    console.log(`Recording started at ${uri}`)
  }

  const stopRecording = async () => {
    const result = await audioRecorderPlayer.stopRecorder()
    audioRecorderPlayer.removeRecordBackListener()
    setAudioPath(result)
    console.log(`Recording stopped and saved at ${result}`)
  }

  const playAudio = async () => {
    if (audioPath) {
      await preparePlayer({ path: audioPath } as IPreparePlayer)
      await playPlayer({ finishMode: undefined, path: "", playerKey: "" })
    }
  }

  const pauseAudio = () => {
    pausePlayer({
      playerKey: "",
    })
  }

  const stopAudio = () => {
    stopPlayer({ playerKey: "" })
  }

  const seekAudio = (position: number) => {
    seekToPlayer({ position } as unknown as ISeekPlayer)
  }

  const adjustVolume = (volume: number) => {
    setVolume(volume)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.waveformContainer}>
        {audioPath && <Waveform ref={waveformRef} mode="live" />}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Play" onPress={playAudio} />
        <Button title="Pause" onPress={pauseAudio} />
        <Button title="Stop" onPress={stopAudio} />
        <Button title="Start Recording" onPress={startRecording} />
        <Button title="Stop Recording" onPress={stopRecording} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  waveformContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
})

export default App
