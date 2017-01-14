This is a small wrapper around the fuzzylite c++ library.

At the moment it just uses the CLI.

# Install

     npm install fuzzylite --save

# Example usage

```javascript
var Fuzzylite = require('fuzzylite');
var fuzzylite = new Fuzzylite('./node_modules/fuzzylite/test-controller.fcl');

var ambience = 0.1;
var cost = 0.2;

fuzzylite.runController([ambience, cost], function callback(error, output) {
    if(error) {
        return console.log('error: ' + error);
    }
    console.log('output is: ' + output);
});
```

Check out the file [test-controller.fcl](test-controller.fcl) for an example
fcl file.
