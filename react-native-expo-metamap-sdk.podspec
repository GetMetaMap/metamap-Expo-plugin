require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-metaMap-sdk"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-metaMap-sdk
                   DESC
  s.homepage     = 'http://getmati.com'
  s.license      = "MIT"
  # s.license    = { :type => "MIT", :file => "FILE_LICENSE" }
  s.authors      = { "Avo Sukiasyan" => "avetik.sukiasyan@metamap.com" }
  s.platforms    = { :ios => "13.0" }
  s.source           = { :path => '.' }
  s.static_framework = true
  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true
  s.dependency 'MetaMapSDK', '3.22.4'
  # s.dependency "..."
end
