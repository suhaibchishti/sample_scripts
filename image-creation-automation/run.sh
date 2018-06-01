#!/bin/bash

user=$(whoami)

        if [ "$user" == "root" ]
        then
                if [ -r /var/tmp/mynamerc_$3.sh ]
                then
                        #source /root/admin-openrc.sh
			source /var/tmp/mynamerc_$3.sh
                        if [ $? -eq 0 ]
                        then
				rm -f /var/tmp/mynamerc_$3.sh
                                instancename=$(nova list --all_tenants|grep $1 | cut -d '|' -f3)
				nova list --all_tenants| grep $1 | grep -i running
				if [ $? -eq 0 ]
				then
                                	nova stop $1
					sleep 30
				else
					nova list --all_tenants | grep $1 | grep -i shutdown
					if [ $? -eq 0 ]
					then
						echo "Instance ID: $1 - Status: Shutdown"
					else
						echo "$1 status is neither shutdown nor running .... "
						echo "Please verify the status of server manually .... "
						echo "Exiting from script ..... "
						exit 1
					fi
				fi

				nova list --all_tenants| grep $1 | grep -i shutdown
                                	if [ $? -eq 0 ]
                                	then
                                        	echo "$1 has been shutdown"
                                        	nova image-create --poll $1 $2.img
                                        	if [ $? -eq 0 ]
                                        	then
                                                	echo "Image created: $2.img"
                                        	else
                                                	echo "Image creation Failed: $2.img"
                                                	echo "Exiting from script ..... "
                                                	exit 1
                                        	fi

                                        	image_id=$(nova image-list | grep $2.img | cut -d '|' -f2| cut -d ' ' -f2)
                                        	#glance image-download --file snapshot.raw $image_id

                                        	#if [ $? -eq 0 ]
                                        	#then
                                        	#        echo "Image downloaded: $image_id"
                                        	#else
                                        	#        echo "Image download failed: $image_id"
                                        	#        echo "Exiting from script ..... "
                                        	#        exit 1
                                        	#fi

						#echo "Command: qemu-img convert -c -p -O qcow2 /var/lib/glance/$image_id $2.qcow2"	
                                        	qemu-img convert -c -p -O qcow2 /var/lib/glance/$image_id $2.qcow2

                                        	if [ $? -eq 0 ]
                                        	then
                                                	echo "Snapshot successfully compressed"
                                        	else
                                                	echo "Failed: Snapshot compresseion failed"
                                                	echo "Exiting from script ..... "
                                                	exit 1
                                        	fi
						
						current_dir=$(pwd)
                                        	glance image-create --name $2 --disk-format qcow2  --container-format bare --file  $current_dir/$2.qcow2
                                        	if [ $? -eq 0 ]
                                        	then
                                                	glance image-list|grep $2
                                                	if [ $? -eq 0 ]
                                                	then
                                                        	echo "Image successfully uploaded: $2"
								echo "Please change the visiblity of image from Private to Public manually"
								glance image-delete $image_id
                                                        	if [ $? -eq 0 ]
                                                        	then
                                                                	echo "Temporary snapshot removed: $image_id"
									echo "Restarting your server: $1"
									nova start $1
									rm -rf $current_dir/$2.qcow2
                                                        	else
                                                                	echo "Failed: Snapshot removal failed"
                                                                	echo "Please try to remove manually"
                                                        	fi
                                                	else
                                                        	echo "Failed: Image upload failed"
                                                        	echo "Exiting from script ..... "
                                                        	exit 1
                                                	fi

                                        	else
                                                	echo "Failed: Image upload failed"
                                                	echo "Exiting from script ..... "
                                                	exit 1
                                        	fi
                                	else
                                        	echo "Failed: Instance shutdown failed"
                                        	echo "Exiting from script ..... "
                                        	exit 1
                                	fi
                        	else
                                	echo "Failed: Credential validation failed"
                                	echo "Exiting from script ..... "
                                	exit 1
                        	fi

                	else
                        	echo "File: /root/admin-openrc.sh is not readble"
                        	echo "Exiting from script ..... "
                        	exit 1
                	fi

        	else
                	echo "Sudo failed, Please retry ... "
                	echo "Exiting from script ..... "
                	exit 1
        	fi
