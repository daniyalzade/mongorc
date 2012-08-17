mongorc
========

Starting with version 2.0, mongodb allows customizing startup message and the shell prompt. This is an attempt to make these messages more useful.
Introduction:
-----------

Mongo shell customization (for versions > 2.0)

Place this file at ~/.mongorc.js

Sample Output
-----------

  System information as of Fri Aug 17 2012 14:02:12 GMT-0400 (EDT)

	** Replication **
	Primary: db03:27017	Replag: 88 (s)

	** Uptime **
	uptime: 73307 (s)	human: 20h and 21m

	** Connections **
	Current: 504	Queued: 0	% read:0	Lock Ratio: 0.265173692921234

	** Asserts **
	User: 1	Warning: 0
    db02:S test> 

The system information gets displayed when the shell starts, and the command prompt has the following format

    host:replstate db>


References:
-----------
http://www.mongodb.org/display/DOCS/Overview+-+The+MongoDB+Interactive+Shell#Overview-TheMongoDBInteractiveShell-CustomPrompt