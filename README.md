# Preparation

## Install MySQL via Docker

- To start this project correctly, you need to install MySQL via using the command below:

```
docker run -d --restart always \
  --name mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=mydb \
  -e MYSQL_USER=app \
  -e MYSQL_PASSWORD=apppass \
  -v $(pwd)/docker-data/mysql:/var/lib/mysql \
  -p 3306:3306 \
  mysql:8.3.0
```

You can start/stop after initialized the container

`docker start mysql`
`docker stop mysql`

### Install mycli via Homebrew

`brew install mycli`

After installed, you can execute command to start mysql, check status or stop it.

After started MySQL, you can manipulate it by using mycli

`mycli -u root -h localhost`

Password is "root" that been set above step
