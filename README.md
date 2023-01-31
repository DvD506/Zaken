# Discord Auto-reply Bot

This is a simple discord bot that could interact with users in channel.
It is based on `discord.js`.

## Function

* Suggest channel to find team based on user's selected region
* Auto-reply user's messages based on parametrized search criteria
* Replies are in embed format with a animated gif image
* Replies can be randomized

## Prequisity

* Nodejs >= 12.0
* Npm >= 6.0

## Installation

### For Windows
You can download the project as a zip and unzip it. Of course you can choose to git clone it.
Then chdir into the project. Use `npm i` to install the dependencies.

### For *nix/macOS
```shell
git clone https://github.com/DvD506/Zaken.git && cd Zaken
npm i
```

## Modify your config

As you can see in this repository, you should first modify `config.json.bak` to make it work.

It must be renamed to `config.json`

```json
{
	"token": "" // token for your bot
}
```

Modify `parameters.json` to add auto-replies or change search criteria

## Run

### Run as a node program

Run it as a program and you could see the console logs.
This is not recommended since you don't have to restart your program to load parameters.
```shell
node index.js
```

### Manage By pm2

It is recommended to manage your nodejs programs by pm2.

```shell
npm i pm2 -g
pm2 start index.js --name discord-zaken-bot
pm2 save
```

## FAQ

**Q: PM2 cannot load(on windows powershell)**

A: Open up powershell(Admin) then input below command and enter:
```powershell
set-ExecutionPolicy RemoteSigned
```
