# Code Coverage Guide

## Understanding the Coverage Report

When you run `pnpm test:coverage:backend`, you'll see a report like this:

```
--------------|---------|----------|---------|---------|----------------------------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------|---------|----------|---------|---------|----------------------------------------
All files     |   87.61 |    65.78 |   72.22 |      91 |                              
 drivers      |    87.5 |    63.88 |   71.42 |    90.9 |                              
  route.ts    |    87.5 |    63.88 |   71.42 |    90.9 | 52-53,69,120,159,179,188,204 
 drivers/[id] |     100 |      100 |     100 |     100 |                              
  route.ts    |     100 |      100 |     100 |     100 | 
 drivers/_lib |      75 |      100 |      50 |      75 | 
  drivers.ts  |      75 |      100 |      50 |      75 | 17
--------------|---------|----------|---------|---------|----------------------------------------
```

This report shows:
- **% Stmts**: Percentage of statements that were executed
- **% Branch**: Percentage of branches (if/else, switch cases, etc.) that were executed
- **% Funcs**: Percentage of functions that were called
- **% Lines**: Percentage of executable lines that were executed
- **Uncovered Line #s**: Specific line numbers that weren't executed during testing

## How to Improve Coverage

### 1. Identify Uncovered Code

First, look at the "Uncovered Line #s" column to find which lines aren't being tested. You can also open the HTML report for a more visual representation:

```bash
# Open the HTML coverage report (Windows)
start coverage/lcov-report/index.html

# Open the HTML coverage report (macOS)
open coverage/lcov-report/index.html

# Open the HTML coverage report (Linux)
xdg-open coverage/lcov-report/index.html
```

### 2. Write Tests for Edge Cases

For the current API, focus on these areas:

#### Branch Coverage
Most branch coverage issues come from conditional statements that aren't fully tested. Add tests for:
- Edge cases in filter and sort functions
- Error handling paths
- Conditional logic in validation

#### Function Coverage
Make sure each function is called at least once during testing:
- Helper functions in utility files
- Error handlers
- Callback functions

### 3. Example: Improving Coverage for `route.ts`

Looking at the uncovered lines (52-53, 69, 120, 159, 179, 188, 204), these likely include:
- Certain filter conditions
- Sort order handling
- Error handling paths

Add tests like:
```typescript
test('filters drivers by minimum wins', async () => {
  // Add test drivers with different win counts
  drivers.push(
    { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 },
    { id: '2', name: 'Driver 2', team: 'Team B', races: 20, wins: 5, firstSeason: 2019 }
  );
  
  const req = new MockRequest('http://localhost:3000/api/drivers?minWins=3');
  const res = await GET(req as any);
  const data = await res.json();
  
  expect(data).toHaveLength(1);
  expect(data[0].name).toBe('Driver 2'); // Only driver with more than 3 wins
});
```

### 4. Testing Error Handling

To test error conditions, you can mock the request to throw errors:
```typescript
test('handles JSON parsing errors in POST', async () => {
  const req = new MockRequest('http://localhost:3000/api/drivers', 'POST');
  req.json = jest.fn().mockRejectedValue(new Error('Invalid JSON'));
  
  const res = await POST(req as any);
  
  expect(res.status).toBe(400);
});
```

## Recent Improvements

We've successfully improved coverage by adding tests for:

1. **Filtering by minimum wins**: Testing the `minWins` filter functionality
2. **Handling invalid filter parameters**: Testing graceful handling of non-numeric parameters
3. **Error handling in POST requests**: Testing JSON parsing error scenarios

This resulted in significant coverage improvements:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Statements | 83.18% | 87.61% | +4.43% |
| Branches | 60.52% | 65.78% | +5.26% |
| Functions | 66.66% | 72.22% | +5.56% |
| Lines | 87% | 91% | +4% |

## Next Steps to Further Improve Coverage

Looking at the remaining uncovered lines, we should focus on:

1. **Line 52-53**: Add tests for the `nameFilter` condition with various case scenarios
2. **Line 69**: Test scenarios where sort parameters are not provided or invalid
3. **Line 120**: Add tests for the POST handler's error catch block
4. **Line 159, 179, 188**: Add tests for edge cases in the PATCH handler
5. **Line 204**: Add tests for the DELETE handler's error scenarios

Example additional test:
```typescript
test('filters drivers by name case-insensitively', async () => {
  drivers.push(
    { id: '1', name: 'Lewis Hamilton', team: 'Mercedes', races: 100, wins: 50, firstSeason: 2007 },
    { id: '2', name: 'Max Verstappen', team: 'Red Bull', races: 80, wins: 40, firstSeason: 2015 }
  );
  
  const req = new MockRequest('http://localhost:3000/api/drivers?name=lewis');
  const res = await GET(req as any);
  const data = await res.json();
  
  expect(data).toHaveLength(1);
  expect(data[0].name).toBe('Lewis Hamilton');
});
```

## Maintaining High Coverage

1. **Write Tests First**: Consider Test-Driven Development (TDD)
2. **Test Edge Cases**: Include tests for unusual inputs and error conditions
3. **Regular Check**: Run coverage reports regularly
4. **CI Integration**: Include coverage checks in your CI/CD pipeline

Remember, 100% coverage doesn't guarantee bug-free code, but it does significantly reduce the risk of regressions and unexpected behavior. 