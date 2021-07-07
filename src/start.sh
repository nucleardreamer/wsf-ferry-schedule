#!/usr/bin/env bash

# set the hostname to wsf
curl -X PATCH --header "Content-Type:application/json" --data '{"network": {"hostname": "wsf"}}' "$BALENA_SUPERVISOR_ADDRESS/v1/device/host-config?apikey=$BALENA_SUPERVISOR_API_KEY"

# Run balena base image entrypoint script
/usr/bin/entry.sh echo "Running balena base image entrypoint..."

# this stops the CPU performance scaling down
echo "Setting CPU Scaling Governor to 'performance'"
echo 'performance' > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor 

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
su -w $environment -c "/opt/node_modules/.bin/electron /opt/index.js" - electron
