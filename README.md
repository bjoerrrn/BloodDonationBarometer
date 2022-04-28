<img src="https://github.com/dusselmann/BloodDonationBarometer/blob/main/SCREEN.jpeg?raw=true" alt="" width=250 align="right"/> 

# BloodDonationBarometer

![stars](https://img.shields.io/github/stars/dusselmann/BloodDonationBarometer) ![last_commit](https://img.shields.io/github/last-commit/dusselmann/BloodDonationBarometer)

A <a href="https://scriptable.app">Scriptable</a> widget for iOS, which shows the so called Blood Donation Barometer [Blutspende-Barometer] for the German Red Cross [Deutsches Rotes Kreuz: DRK].

The widget pulls data from one of the DRK website every 4-7 minutes. This is triggered by iOS and can not be changed. Currently the northwest from the DRK regions is supported - more to come. 

# setup
1. Install <a href="https://scriptable.app">Scriptable</a> on your iPhone from the App Store.
2. Download `bloodDonationBarometerWidget.js` from this repository.
4. Import `bloodDonationBarometerWidget.js` in Scriptable.

# usage
The widget currently supports 3 regional German red cross entities: 
```
## DRK-BLUTSPENDEDIENST

# parameter   # description
  no            Nord-Ost (Berlin, Brandenburg, Hamburg, Sachsen, Schleswig-Holstein)
  nstob         NSTOB (Niedersachsen, Sachsen-Anhalt, Thüringen, Oldenburg, Bremen) 
  bwh           Baden-Württemberg, Hessen
  
## SRK-BLUTSPENDEDIENST

# parameter   # description
  ...
```
You need to choose one of the entities above; example: `parameter: no`

# coming soon
* Blutspende SRK Schweiz incl. regional barometers!
* proper formatting of status date

## contributing

[issues](https://github.com/dusselmann/BloodDonationBarometer/issues) and [pull requests](https://github.com/dusselmann/BloodDonationBarometer/pulls) are welcome. for major changes, please open an [issue](https://github.com/dusselmann/BloodDonationBarometer/issues) first to discuss what you would like to change.

if you want to contact me directly, feel free to do so via discord: https://discordapp.com/users/371404709262786561

## license

[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)
