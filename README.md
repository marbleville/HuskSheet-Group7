# HuskSheet-Group7 (Group 1)

## Project Description

The course project is a distributed collaborative spreadsheet application called Husksheets. It consists of (1) a server with a persistent store, (2) a client able to create and open spreadsheets, and (3) a user interface that displays sheets and allows editing them.

## Overview

Our project is split into two distinct parts, the server, express based, and the client, using React. We are using typecript for boths parts.

## Server Design and Implementation

The server is implemented using express and typescript. It is responsible for handling requests from the client, and managing the data store.
There are two key singleton classes in the server, DatabaseInstance and HashStore. The DatabaseInstance class provides the ability to easily
query the mySQL db. The HashStore class is a singleton that stores the current, accepted state of all the sheets in memory. The HashStore is
initialized with the data from the database when the server starts up. The server also assembled the data from these two stores into objects
that the client expects.

Improvements to the server could include many performance improvementsrelated to making more use of the HashStore. We can add functionality
that uses the hash store for more operations. We can also sotre the hash in the db on server shutdown to avoid reconstructing the hash each
time we run the sever.
