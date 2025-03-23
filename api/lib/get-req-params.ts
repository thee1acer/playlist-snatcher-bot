export function getPlaylistHeaderParams(playlistUrl: string) {
  const { videoId, playlistId } = extractParams(playlistUrl);

  const shortLink = playlistId?.split("//www.youtube.com")?.[1] ?? "";

  return {
    context: {
      client: {
        hl: "en-GB",
        gl: "ZA",
        remoteHost: "41.122.148.39",
        deviceMake: "",
        deviceModel: "",
        visitorData: "CgtQWS1RTlF3c2gtcyiM9P--BjIKCgJaQRIEGgAgOg%3D%3D",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36,gzip(gfe)",
        clientName: "WEB",
        clientVersion: "2.20250319.01.00",
        osName: "Windows",
        osVersion: "10.0",
        originalUrl: playlistUrl,
        screenPixelDensity: 0,
        platform: "DESKTOP",
        clientFormFactor: "UNKNOWN_FORM_FACTOR",
        screenDensityFloat: 0.4166666865348816,
        userInterfaceTheme: "USER_INTERFACE_THEME_DARK",
        timeZone: "Africa/Johannesburg",
        browserName: "Chrome",
        browserVersion: "134.0.0.0",
        acceptHeader:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        deviceExperimentId:
          "ChxOelE0TkRrM05qQXpOalF6TWpJME1ERTVPUT09EIz0_74GGIz0_74G",
        rolloutToken: "CIGAs6bdj-6l-wEQraKb1LevigMYpIL92PufjAM%3D",
        screenWidthPoints: 1588,
        screenHeightPoints: 2188,
        utcOffsetMinutes: 120,
        memoryTotalKbytes: "8000000",
        clientScreen: "WATCH",
        mainAppWebInfo: {
          graftUrl: shortLink,
          pwaInstallabilityStatus: "PWA_INSTALLABILITY_STATUS_UNKNOWN",
          webDisplayMode: "WEB_DISPLAY_MODE_BROWSER",
          isWebNativeShareAvailable: true
        }
      },
      user: {
        lockedSafetyMode: false
      },
      request: {
        useSsl: true,
        internalExperimentFlags: [],
        consistencyTokenJars: []
      },
      clickTracking: {
        clickTrackingParams:
          "CMQBEIrSDRgAIhMI5_La-JWgjAMVu5L0Bx2Lhw44MgpnLWhpZ2gtcmVjWg9GRXdoYXRfdG9fd2F0Y2iaAQYQjh4YngE="
      }
    },
    videoId: videoId,
    playlistId: playlistId,
    params: "OALAAQE%3D",
    racyCheckOk: false,
    contentCheckOk: false,
    autonavState: "STATE_ON",
    playbackContext: {
      vis: 0,
      lactMilliseconds: "-1"
    },
    captionsRequested: false
  };
}

export function getPlaylistItemHeaderParams(
  playlistUrl: string,
  index: number
) {
  const { videoId, playlistId } = extractParams(playlistUrl);

  return {
    context: {
      client: {
        hl: "en-GB",
        gl: "ZA",
        remoteHost: "41.122.148.39",
        deviceMake: "",
        deviceModel: "",
        visitorData: "CgtQWS1RTlF3c2gtcyi96_--BjIKCgJaQRIEGgAgOg%3D%3D",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36,gzip(gfe)",
        clientName: "WEB",
        clientVersion: "2.20250319.01.00",
        osName: "Windows",
        osVersion: "10.0",
        originalUrl: `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}&index=${index}`,
        screenPixelDensity: 1,
        platform: "DESKTOP",
        clientFormFactor: "UNKNOWN_FORM_FACTOR",
        configInfo: {
          appInstallData:
            "CL3r_74GEN_YzhwQhfn_EhCI468FEJ7LzhwQvO_OHBDf3M4cEMvRsQUQmY2xBRC9mbAFEJ2msAUQmZixBRDJ5rAFELvZzhwQ4eywBRDk5_8SEIjyzhwQiafOHBDg4P8SEJ7bzhwQlPyvBRC45M4cEJPZzhwQh6zOHBDb2s4cELfq_hIQ-KuxBRCmmc4cEPyyzhwQieiuBRC9tq4FEObjzhwQ9quwBRDbr68FEL--zhwQ0-GvBRCNzLAFEImwzhwQzdGxBRDi1K4FEJ3QsAUQyfj_EhDu8c4cEIPuzhwQkYz_EhCf_P8SEO3ezhwQr_POHBDM364FEL6KsAUQlP6wBRDv2c4cENfBsQUQ4M2xBRCEvc4cEP3xzhwQiIewBRCa584cEOODuCIQyfevBRCBzc4cEKaasAUQ2OnOHBDevM4cEPDizhwQ6-j-EhC52c4cEK3yzhwQ1ff_EiosQ0FNU0d4VVFvTDJ3RE5Ia0JwU0NFdWZpNWd1UDlBN3Ytd2I1N0FNZEJ3PT0%3D"
        },
        screenDensityFloat: 1.25,
        userInterfaceTheme: "USER_INTERFACE_THEME_DARK",
        timeZone: "Africa/Johannesburg",
        browserName: "Chrome",
        browserVersion: "134.0.0.0",
        acceptHeader: "*/*",
        deviceExperimentId:
          "ChxOelE0TkRrM01USTVOems0TXpJNU9Ea3lNZz09EL3r_74GGL3r_74G",
        rolloutToken: "CIGAs6bdj-6l-wEQraKb1LevigMYpIL92PufjAM%3D",
        screenWidthPoints: 431,
        screenHeightPoints: 730,
        utcOffsetMinutes: 120,
        memoryTotalKbytes: "8000000",
        clientScreen: "WATCH",
        mainAppWebInfo: {
          graftUrl: `/watch?v=${videoId}&list=${playlistId}&index=${index}`,
          pwaInstallabilityStatus: "PWA_INSTALLABILITY_STATUS_UNKNOWN",
          webDisplayMode: "WEB_DISPLAY_MODE_BROWSER",
          isWebNativeShareAvailable: true
        }
      },
      user: {
        lockedSafetyMode: false
      },
      request: {
        useSsl: true,
        internalExperimentFlags: [],
        consistencyTokenJars: []
      },
      clickTracking: {
        clickTrackingParams: "IhMIj42ws_2gjAMVbz3xBR2D6DeQMghleHRlcm5hbA=="
      },
      adSignalsInfo: {
        params: [
          {
            key: "dt",
            value: "1742759591645"
          },
          {
            key: "flash",
            value: "0"
          },
          {
            key: "frm",
            value: "0"
          },
          {
            key: "u_tz",
            value: "120"
          },
          {
            key: "u_his",
            value: "11"
          },
          {
            key: "u_h",
            value: "864"
          },
          {
            key: "u_w",
            value: "1536"
          },
          {
            key: "u_ah",
            value: "816"
          },
          {
            key: "u_aw",
            value: "1536"
          },
          {
            key: "u_cd",
            value: "24"
          },
          {
            key: "bc",
            value: "31"
          },
          {
            key: "bih",
            value: "730"
          },
          {
            key: "biw",
            value: "416"
          },
          {
            key: "brdim",
            value: "0,0,0,0,1536,0,1536,816,431,730"
          },
          {
            key: "vis",
            value: "1"
          },
          {
            key: "wgl",
            value: "true"
          },
          {
            key: "ca_type",
            value: "image"
          }
        ],
        bid: "ANyPxKpaDRjCJyxugNcnz9WMsll0cOFO03mbOgsS8iM48pk3k_TuPaAATUvrX2wlvEjw1ghSnhWbcqnVqu9q7pJ7A4GV_IWAWw"
      }
    },
    videoId: videoId,
    playlistId: playlistId,
    playlistIndex: 3,
    playbackContext: {
      contentPlaybackContext: {
        currentUrl: `/watch?v=${videoId}&list=${playlistId}&index=${index}`,
        vis: 0,
        splay: false,
        autoCaptionsDefaultOn: false,
        autonavState: "STATE_ON",
        html5Preference: "HTML5_PREF_WANTS",
        signatureTimestamp: 20166,
        referer: "",
        lactMilliseconds: "-1",
        watchAmbientModeContext: {
          hasShownAmbientMode: true,
          watchAmbientModeEnabled: true
        }
      }
    },
    racyCheckOk: false,
    contentCheckOk: false,
    serviceIntegrityDimensions: {
      poToken:
        "MlPJJbLMxhmJi8kZROyBKcXKJsPbmn6u-AEzqC0ohqE3VdAXTUWbfRn_1DWHCkHHK531qGDP39qePDEOGgflW1brz1S4zXfi6FU_u1z4OEix3afaLA=="
    }
  };
}

function extractParams(playlistUrl: string) {
  const url = new URL(playlistUrl);
  const params = new URLSearchParams(url.search);

  const videoId = params.get("v");
  const playlistId = params.get("list");

  return { videoId, playlistId };
}
