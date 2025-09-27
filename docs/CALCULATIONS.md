# Era Calculation Logic

This document explains the logic used for era and block height calculations in the Casper Era Tracker.

## Key Assumptions

-   **Era Duration**: Approximately 2 hours (7200 seconds).
-   **Blocks per Era**: Approximately 450 blocks.

## Formulas

### Block Height Formula

```
Next Switch Block Height = Last Switch Block Height + 450 blocks
Future Era Block Height = Last Switch Block Height + (Era Difference × 450 blocks)
```

### Time Calculations

```
Future Era Time = Last Switch Block Time + (Era Difference × 2 hours)
```

### Date/Time Mode Logic

1.  Calculate the time difference between the selected future date and the last switch block time.
2.  Determine how many 2-hour era periods have passed in that duration.
3.  Calculate the specific era number that will be active at the selected time.
4.  Determine the start and end times of that calculated era.
5.  Calculate the expected block height at that time.




---

[Back to README](../README.md)

