#!/usr/bin/env bash

# set the hostname to wsf
curl -X PATCH --header "Content-Type:application/json" --data '{"network": {"hostname": "wsf"}}' "$BALENA_SUPERVISOR_ADDRESS/v1/device/host-config?apikey=$BALENA_SUPERVISOR_API_KEY"

# Run balena base image entrypoint script
/usr/bin/entry.sh echo "Running balena base image entrypoint..."

export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket

sed -i -e 's/console/anybody/g' /etc/X11/Xwrapper.config
echo "needs_root_rights=yes" >> /etc/X11/Xwrapper.config
dpkg-reconfigure xserver-xorg-legacy


# this stops the CPU performance scaling down
echo "Setting CPU Scaling Governor to 'performance'"
echo 'performance' > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor 

 #Set whether to show a cursor or not
if [[ ! -z $SHOW_CURSOR ]] && [[ "$SHOW_CURSOR" -eq "1" ]]
  then
    export CURSOR=''
    echo "Enabling cursor"
  else
    export CURSOR='-- -nocursor'
    echo "Disabling cursor"
fi

# If the vcgencmd is supported (i.e. RPi device) - check enough GPU memory is allocated
if command -v vcgencmd &> /dev/null
then
	echo "Checking GPU memory"
    if [ "$(vcgencmd get_mem gpu | grep -o '[0-9]\+')" -lt 128 ]
	then
	echo -e "\033[91mWARNING: GPU MEMORY TOO LOW"
	fi
fi

# set up the user data area
chown -R electron:electron /data
mkdir -p /data/electron

# we can't maintain the environment with su, because we are logging in to a new session
# so we need to manually pass in the environment variables to maintain, in a whitelist
# This gets the current environment, as a comma-separated string
environment=$(env | grep -v -w '_' | awk -F: '{ st = index($0,"=");print substr($1,0,st) ","}' | tr -d "\n")
# remove the last comma
environment="${environment::-1}"

# launch electron and whitelist the enVars so that they pass through to the su session
su -w $environment -c "export DISPLAY=:0 && startx /opt/startx.sh $CURSOR" - electron
