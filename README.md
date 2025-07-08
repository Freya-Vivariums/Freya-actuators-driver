![Freya Banner](https://raw.githubusercontent.com/Freya-Vivariums/.github/refs/heads/main/brand/Freya_banner.png)

<a href="https://github.com/Edgeberry/Edgeberry-HWCartridge-SenseAndDrive?tab=readme-ov-file" target="_blank" >
<img src="https://github.com/Edgeberry/Edgeberry-HWCartridge-SenseAndDrive/blob/main/documentation/SenseAndDrive_Cartridge.png?raw=true" align="right" width="40%"/>
</a>

The **Freya Actuators Driver** is the output-control component of the Freya Vivarium Control System build with the [Edgeberry Sense’n’Drive Hardware Cartridge](https://github.com/Edgeberry/Edgeberry-HWCartridge-SenseAndDrive?tab=readme-ov-file). Exposed over D-Bus, it translates simple commands into dependable on/off and PWM signals.

<br clear="right"/>

## Installation
When installing the Freya system, the **system actuators driver is automatically installed** with the rest of the system. For manual installation run these commands on your device:

```
wget -O install.sh https://github.com/Freya-Vivariums/Freya-actuators-driver/releases/latest/download/install.sh;
chmod +x ./install.sh;
sudo ./install.sh;
```

The software is installed as a `systemd` service, which is automatically started.
```
systemctl status io.freya.SystemActuatorsDriver.service
```

To view the log files of the service, run:
```
journalctl -u io.freya.SystemActuatorsDriver.service -f
```

## Application programming
The Freya System Actuators Driver uses `DBus` to interact with applications. You can check the DBus object path’s interfaces, methods, properties and signals using `busctl`:
```
sudo busctl introspect io.freya.SystemActuatorsDriver /io/freya/SystemActuatorsDriver io.freya.SystemActuatorsDriver
```
For testing, you can also call methods using `busctl`, for example setting `Digital out 1` high:
```
sudo busctl call io.freya.SystemActuatorsDriver /io/freya/SystemActuatorsDriver io.freya.SystemActuatorsDriver setDigitalOutput ib 1 true

```

## License & Collaboration
**Copyright© 2025 Sanne 'SpuQ' Santens**. The Freya System Actuators Driver project is licensed under the **[MIT License](LICENSE.txt)**. The [Rules & Guidelines](https://github.com/Freya-Vivariums/.github/blob/main/brand/Freya_Trademark_Rules_and_Guidelines.md) apply to the usage of the Freya Vivariums™ brand.

### Collaboration

If you'd like to contribute to this project, please follow these guidelines:
1. Fork the repository and create your branch from `main`.
2. Make your changes and ensure they adhere to the project's coding style and conventions.
3. Test your changes thoroughly.
4. Ensure your commits are descriptive and well-documented.
5. Open a pull request, describing the changes you've made and the problem or feature they address.