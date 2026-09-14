# Configuring CODEOWNERS for your package

The `CODEOWNERS` file in this repo denotes who owns the template itself. When creating a new package, replace its contents with one of the patterns below, then delete this file.

> [!IMPORTANT]
> Use eligible GitLab group paths (for example, `@defenseunicorns/uds/uds-foundry`) instead of individual usernames where possible. Only direct members of an eligible group can approve as Code Owners.

Code Owner approvals are enforced only when the target branch is protected and **Require approval from code owners** is enabled in its branch rule.

## Standard pattern

```
* @defenseunicorns/uds/uds-foundry @creator-group

/CODEOWNERS @jeff-mccoy @daveworth
/LICENS* @jeff-mccoy @austenbryan
```

This combines `uds-foundry` with the package's creator group on a single line. One eligible user from either group can satisfy the Code Owner approval. Replace `@creator-group` with the full GitLab group or subgroup path for the group that built the package, and ensure that group is eligible for the project.

The `/CODEOWNERS` and `/LICENS*` lines pin those files to Defense Unicorns release engineering — keep them as-is.

## Requiring approval from every group

GitLab evaluates each CODEOWNERS section independently. If every group must approve a merge request, put each group in its own required section.

```
[UDS Foundry] @defenseunicorns/uds/uds-foundry
*

[Creator Group] @creator-group
*

[Other Group] @other-group
*

[Release Engineering]
/CODEOWNERS @jeff-mccoy @daveworth
/LICENS* @jeff-mccoy @austenbryan
```

GitLab does not support inline comments in `CODEOWNERS`. Put comments on their own lines so mentioned users or groups are not accidentally parsed as owners.
