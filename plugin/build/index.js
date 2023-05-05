"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGradleMaven = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("./constants");
const pkg = require('react-native-metamap-sdk/package.json');
const CAMERA_USAGE = 'Allow $(PRODUCT_NAME) to access your camera';
const MICROPHONE_USAGE = 'Allow $(PRODUCT_NAME) to access your microphone';
async function readFileAsync(path) {
    return fs_1.default.promises.readFile(path, 'utf8');
}
async function saveFileAsync(path, content) {
    return fs_1.default.promises.writeFile(path, content, 'utf8');
}
function addLines(content, find, offset, toAdd) {
    const lines = content.split('\n');
    let lineIndex = lines.findIndex((line) => line.match(find));
    for (const newLine of toAdd) {
        if (!content.includes(newLine)) {
            lines.splice(lineIndex + offset, 0, newLine);
            lineIndex++;
        }
    }
    return lines.join('\n');
}
// Because we need the package to be added AFTER the React and Google maven packages, we create a new allprojects.
// It's ok to have multiple allprojects.repositories, so we create a new one since it's cheaper than tokenizing
// the existing block to find the correct place to insert our camera maven.
const gradleMaven = 'allprojects { repositories { maven { url "$rootDir/../node_modules/react-native-metaMap-sdk/android/maven" } } }';
const withAndroidCameraGradle = (config) => {
    return (0, config_plugins_1.withProjectBuildGradle)(config, (config) => {
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = setGradleMaven(config.modResults.contents);
        }
        else {
            throw new Error('Cannot add camera maven gradle because the build.gradle is not groovy');
        }
        return config;
    });
};
function setGradleMaven(buildGradle) {
    if (buildGradle.includes('react-native-metaMap-sdk/android/maven')) {
        return buildGradle;
    }
    return buildGradle + `\n${gradleMaven}\n`;
}
exports.setGradleMaven = setGradleMaven;
const withCamera = (config, { cameraPermission, microphonePermission } = {}) => {
    if (!config.ios)
        config.ios = {};
    if (!config.ios.infoPlist)
        config.ios.infoPlist = {};
    config.ios.infoPlist.NSCameraUsageDescription =
        cameraPermission || config.ios.infoPlist.NSCameraUsageDescription || CAMERA_USAGE;
    config.ios.infoPlist.NSMicrophoneUsageDescription =
        microphonePermission || config.ios.infoPlist.NSMicrophoneUsageDescription || MICROPHONE_USAGE;
    return (0, config_plugins_1.withPlugins)(config, [
        [
            config_plugins_1.AndroidConfig.Permissions.withPermissions,
            [
                'android.permission.CAMERA',
                // Optional
                'android.permission.RECORD_AUDIO',
            ],
        ],
        withAndroidCameraGradle,
    ]);
};
async function editPodfile(config, action) {
    const podfilePath = path_1.default.join(config.modRequest.platformProjectRoot, 'Podfile');
    try {
        const podfile = action(await readFileAsync(podfilePath));
        return await saveFileAsync(podfilePath, podfile);
    }
    catch (e) {
        config_plugins_1.WarningAggregator.addWarningIOS('expo-dev-menu', `Couldn't modified AppDelegate.m - ${e}.
See the expo-dev-client installation instructions to modify your AppDelegate manually: ${constants_1.InstallationPage}`);
    }
}
const withDevMenuPodfile = (config) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        'ios',
        async (config) => {
            await editPodfile(config, (podfile) => {
                podfile = podfile.replace("platform :ios, '11.0'", "platform :ios, '11.4'");
                // Match both variations of Ruby config:
                // unknown: pod 'expo-dev-menu', path: '../node_modules/expo-dev-menu', :configurations => :debug
                // Rubocop: pod 'expo-dev-menu', path: '../node_modules/expo-dev-menu', configurations: :debug
                if (!podfile.match(/pod ['"]expo-dev-menu['"],\s?path: ['"][^'"]*node_modules\/expo-dev-menu['"],\s?:?configurations:?\s(?:=>\s)?:debug/)) {
                    const packagePath = path_1.default.dirname(require.resolve('expo-dev-menu/package.json'));
                    const relativePath = path_1.default.relative(config.modRequest.platformProjectRoot, packagePath);
                    podfile = addLines(podfile, 'use_react_native', 0, [
                        `  pod 'expo-dev-menu', path: '${relativePath}', :configurations => :debug`,
                    ]);
                }
                return podfile;
            });
            return config;
        },
    ]);
};
const index = (config) => {
    config = withDevMenuPodfile(config);
    config = withCamera(config);
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(index, pkg.name, pkg.version);
