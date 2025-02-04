Write a Python function that takes a date string like `'Sat Apr 29 2023 20:04:15 GMT+0300 (Moscow Standard Time)'` as input, parses it into a `datetime` object, and converts the parsed date and time into UTC. The time zone information (`GMT+0300`) in the input string should be correctly handled, ensuring the conversion accounts for the time difference.

The function should return a `datetime` object in UTC. Also, the function should be capable of handling similar input formats with different time zone offsets, not just the specific example provided.

For example:
```python
parse_to_utc('Sat Apr 29 2023 20:04:15 GMT+0300 (Moscow Standard Time)')
```
This should return the equivalent time in UTC.