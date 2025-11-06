The current `CODEOWNERS` file that exists, is to denote who owns this `uds-package-template`. If you are creating a new package from this template, you can copy / paste one of the below examples into the `CODEOWNERS` file, then modify the string to fit your needs. After updating the `CODEOWNERS` file to your liking, you can delete this file. 

The `CODEOWNERS` file should follow the below format, you can even just copy / paste the exact text into the `CODEOWNERS` file. 

```
* @uds-packages/uds-foundry
# * @additional-team - as appropriate

/CODEOWNERS @jeff-mccoy @daveworth
/LICENS* @jeff-mccoy @austenbryan
```

If you would like to add optional package reviewers, such as the creator of the app, you can append creators after `uds-foundry`

For instance, you could handle this like below: 

```
* @defenseunicorns/uds-foundry @name-of-creator/s @name-of-established-known-team

/CODEOWNERS @jeff-mccoy @daveworth 
/LICENS* @jeff-mccoy @austenbryan
```

Keeping the reviewers on one line, like the above format, makes it easier on Bullpen to approve Support / Maintenance PRs on a package. 
This format with everything on one line, enables an `OR` for package approvers. So, `uds-foundry` OR `@name-of-creator/s` could approve a PR. 


If you break the lines up like the below, then it becomes an `AND`. So, it would take both `uds-foundry` AND `@name-or-creator/s` to approve a PR. 

```
* @defenseunicorns/uds-foundry
* @name-of-creator/s #optional during package creation to enable velocity
* @name-of-established-known-team #optional addition to "uds-foundry"

/CODEOWNERS @jeff-mccoy @daveworth 
/LICENS* @jeff-mccoy @austenbryan
```
