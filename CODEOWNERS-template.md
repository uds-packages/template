# Configuring CODEOWNERS for your package

The `CODEOWNERS` file in this repo denotes who owns the template itself. When creating a new package, replace its contents with one of the patterns below, then delete this file.

> [!IMPORTANT]
> Use GitHub team handles (e.g., `@uds-packages/uds-foundry`), not individual user handles. Teams stay current as people join and leave; pinning to individuals leaves reviews orphaned and creates approval bottlenecks.

## Standard pattern

```
* @uds-packages/uds-foundry @creator-team

/CODEOWNERS @jeff-mccoy @daveworth
/LICENS* @jeff-mccoy @austenbryan
```

This combines `uds-foundry` with the package's creator team on a single line — either team can approve a PR (OR semantics). Replace `@creator-team` with the GitHub team handle for the group that built the package.

The `/CODEOWNERS` and `/LICENS*` lines pin those files to Defense Unicorns release engineering — keep them as-is.

## Requiring approval from every group (AND)

If every team must weigh in before a PR can merge, put each owner on its own `*` line.

```
* @uds-packages/uds-foundry
* @creator-team
* @other-team

/CODEOWNERS @jeff-mccoy @daveworth
/LICENS* @jeff-mccoy @austenbryan
```
