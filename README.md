# Preparation

## Install MySQL locally

- To start this project correctly, you need to install MySQL in your local computer.

### Install via Homebrew

`brew install mysql mycli`

After installed, you can execute command to start mysql, check status or stop it. 

`brew services list`
`brew services start mysql`
`brew services stop mysql`

After started MySQL, you can manipulate it by using mycli

`mycli -u root -h localhost`

### Uninstall MySQL

`brew uninstall mysql`

Some local data won't be deleted by Homebrew. It needs to execute additional command:

`sudo rm -rf /usr/local/var/mysql`