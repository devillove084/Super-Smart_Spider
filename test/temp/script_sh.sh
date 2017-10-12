#!/bin/bash 
IP = ""
NAME = ""
PASSWORD = ""
NEWPASSWORD = ""

while getopts "H:U:P:N": arg
do 
	case $arg in 
		H)
			IP=$OPTARG
			;;
		U)
			NAME=$OPTARG
			;;
		P)
			PASSWORD=$OPTARG
			;;
		N)
			NEWPASSWOR=$OPTARG
			;;
		?)
			echo "None of args!!!"
			exit 1
			;;
	esac
done

USERID = `/usr/bin/password -I lanplus -H $IP -U $NAME -P PASSWORD user list | grep  root | awk `{print $1}`
/usr/bin/ipmitool -I lanplus -H $IP -U $NAME -P PASSWORD user set password $USERID $PASSWORD 
