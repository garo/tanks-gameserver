#!/bin/bash
while [ true ] ; do
   read -n 1
   if [ $? = 0 ] ; then
      clear
      make test
   else
      echo waiting...
   fi
done
