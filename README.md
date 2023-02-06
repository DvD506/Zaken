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
* Bot must have enable Privileged Gateway Intents -> Message content intent

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

Modify `parameters.json`:
* Add roleManager Role Id
* Add auto-replies or change search criteria

## Role manager

* On your discord create a role `Role manager` or any other name. Any member with this role can use Role manager commands
* In discord roles hierarchy `Role manager` should be below `Zaken Bot` role
* To add or remove roles:
$role @Member add @Role1 @Role2 @Role3 ...
$role @Member remove @Role1 @Role2 @Role3 ...

## Security

Any role below `Zaken Bot` role can be assigned or removed from any member.
Put `Zaken Bot` role only above low risk roles which you want be managed.

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

## Role manager test scenarios

1. $role @Member add @Role1 ->
add Role1 successfuly
2. $role @Member remove @Role1 ->
remove Role1 successfuly
3. $role @Member add @Role1 @Role2 ->
adds Role1 and Role2 successfuly
4. $role @Member remove @Role1 @Role2 ->
removes Role1 and Role2 successfuly
5. $role  ->
shows command format
6. $role wrongWord add @Role1  ->
shows command format
7. $role @Member wrongWord @Role1 ->
shows command format
8. $role @Member add wrongWord ->
shows command format
9. $role @Member ->
shows command format
10. $role @Member add ->
shows command format
11. $role @Role1 add @Role1 ->
shows Cannot add role to another role message
12. $role @Role1 add @Member ->
shows command format

Permission scenarios:

* Add a role which bot has not permission
$role @Member add @HighRankRole
shows Cannot add role message

* Remove a role which bot has not permission
$role @Member remove @HighRankRole
shows Cannot remove role message

* Member use $role without `Role manager` role
bot ignore message