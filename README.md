# chd [![Built with Devbox](https://www.jetify.com/img/devbox/shield_galaxy.svg)](https://www.jetify.com/devbox/docs/contributor-quickstart/)

A command line tool to make changing to frequently visited directories faster by allowing the user to link it to a name.
Then by using 'chd name' the terminal will change to the linked directory.

---

### Install

Install using npm

`npm i -g chd-oclif`

It should then prompt you to add an alias for chd

---

### Uninstall

Uninstall using npm

`npm un -g chd-oclif`

Then remove the chd alias from your alias file

---

### Usage

A usage guide can be found using:

`chd help`

To change your directory, use a directory name:

`chd name`

To change to a subdirectory, use a directory name + /subdirectory:

`chd name/sub-directory`

To get a list of your linked directories:

`chd list`

To add onto your current directory:

`chd add name`

To add onto your list of linked directories:

`chd add name directory`

To rename an existing linked directory:

`chd rename name`

To delete an existing linked directory:

`chd delete name`

To see installation instructions:

`chd install`

---

#### Predecessor

This is an oclif implementation of the project:<br>https://github.com/zacharyedwardsdowns/chd-node

#### Note

More than one directory name is allowed to point to a single directory, however each directory name must be unique.
