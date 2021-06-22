# Washington State Ferry Schedule

![alt text](https://github.com/nucleardreamer/wsf-ferry-schedule/blob/master/wsf-ui.gif?raw=true "UI gif capture")

[![balena deploy button](https://www.balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/nucleardreamer/wsf-ferry-schedule)

TODO: Add all the info

## Departing and Arriving IDs

To configure the application, you will need to find the ID corresponding to your terminals and set the environment variables of `ARRIVING_ID` and `DEPARTING_ID` from the table below. If you enter IDs that do not correspond to any actual route, the application wont display anything!

| Terminal Name | ID |
| --- | --- |
| Anacortes | `1` |
| Bainbridge Island | `2` |
| Bremerton | `4` |
| Clinton | `5` |
| Seattle | `7` |
| Edmonds | `8` |
| Fauntleroy | `9` |
| Friday Harbor | `10` |
| Coupeville | `11` |
| Kingston | `12` |
| Lopez Island | `13` |
| Mukilteo | `14` |
| Orcas Island | `15` |
| Point Defiance | `16` |
| Port Townsend | `17` |
| Shaw Island | `18` |
| Southworth | `20` |
| Tahlequah | `21` |
| Vashon Island | `22` |

## WSDOT API Key

It is generally a good idea to configure your own API key for pulling schedules. The current default API key will probably get rate limited and you will have errors pulling schedule information. 

All you need to do is head [here](https://www.wsdot.com/traffic/api/), enter your email, and copy + paste your API key to the `WSF_API_KEY` environment variable.
