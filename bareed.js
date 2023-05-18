/**************************************************************
 * Point: defines a point on the map using X and Y coordinates
 *
 * x: x coordinate
 * y: y coordinate
 *
 * distanceTo(point): takes a point, calculates the distance to
 *                     that point from the current point.
 *
 * let point = new Point(x, y);
 ****************************************************************/
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceTo = (point) => {
    let xDelta = this.x - point.x;
    let yDelta = this.y - point.y;
    return Math.sqrt(xDelta * xDelta + yDelta * yDelta); // PYTHAGORAS!
  };

  equals = (point) => point.x === this.x && point.y === this.y;

  static randomPoint = (maxX, maxY) => {
    let x = Math.random() * (maxX || 100);
    let y = Math.random() * (maxY || 100);
    return new Point(x, y);
  };
}
const point1 = new Point(19, 170);

console.log(point1.distanceTo({ x: 29, y: 280 }));
console.log("**************************************");
/**********************************************************
 * Wallet: keeps track of money
 *
 * money: how much money is in the wallet. Defaults to 0.
 *
 * credit(amount): adds `amount` to `money`.
 *
 * debit(amount): subtracts `amount` from `money`.
 *
 * let wallet = new Wallet(money);
 **********************************************************/
class Wallet {
  // implement Wallet!
  constructor(money = 0) {
    this.money = money;
  }

  credit = (amount) => {
    this.money += amount;
  };

  debit = (amount) => {
    this.money -= amount;
  };
}
const wallet1 = new Wallet(100);

wallet1.credit(10);
wallet1.debit(15);

console.log(wallet1.money);
console.log("**************************************");
/**********************************************************
 * Person: defines a person with a name (and feelings)
 *
 * name: name of said person
 * location: a Point instance
 * wallet: a Wallet instance initially with 0.
 *
 * moveTo(point): updates the `location` to `point`
 *
 * let person = new Person(name, x, y);
 **********************************************************/
class Person {
  constructor(name, x, y) {
    this.name = name;
    this.location = new Point(x, y);
    this.wallet = new Wallet(0);
  }

  moveTo = (point) => {
    this.location = point;
  };
}
const person1 = new Person("Athony", 1, 3);
person1.moveTo(point1);
console.log(person1.location);

console.log("**************************************");

/**********************************************************
 * Vendor: defines a vendor
 * Subclasses Person
 *
 * range: the maximum distance this vendor can travel - initially 5
 * price: the cost of a single ice cream - initially 1
 *
 * sellTo(customer, numberOfIceCreams):  sells a specific number of ice creams
 *     to the customer by doing the following:
 *         - Moves to the customer's location
 *         - Transfers money from the customer's wallet
 *           to the vendor's wallet
 *
 * new vendor = new Vendor(name, x, y);
 **********************************************************/
class Vendor extends Person {
  range = 5;
  price = 1;
  constructor(name, location, wallet) {
    super(name, location, wallet);
  }
  sellTo = (customer, numberOfIceCreams) => {
    this.moveTo(customer.location);
    customer.wallet.debit(numberOfIceCreams * this.price);
    this.wallet.credit(numberOfIceCreams * this.price);
  };
}

/**********************************************************
 * Customer: defines a customer
 * Subclasses Person
 *
 * wallet: a Wallet instance initially with 10.
 *
 * _isInRange(vendor): checks if the customer is in range of vendor.
 *
 * _haveEnoughMoney(vendor, numberOfIceCreams): checks if the customer
 *     has enough money to buy a specific number of ice creams from vendor.
 *
 * requestIceCream(vendor, numberOfIceCreams): if the customer is in the vendor's
 *     range and has enough money for ice cream, a request is sent to the vendor.
 *
 * new customer = new Customer(name, x, y);
 **********************************************************/
class Customer extends Person {
  // implement Customer!
  constructor(name, location, wallet) {
    super(name, location, wallet);
    this.wallet.money = 10;
  }

  _isInRange = (vendor) => {
    return this.location.distanceTo(vendor.location) <= vendor.range;
  };

  _haveEnoughMoney = (vendor, numberOfIceCreams) => {
    return this.wallet.money >= numberOfIceCreams * vendor.price;
  };

  requestIceCream = (vendor, numberOfIceCreams) => {
    if (
      this._isInRange(vendor) &&
      this._haveEnoughMoney(vendor, numberOfIceCreams)
    ) {
      vendor.moveTo(this.location);
      vendor.sellTo(this, numberOfIceCreams);
    } else {
      if (this._isInRange(vendor) === false) {
        console.log(
          `Customer ${this.name} is out of range of vendor ${vendor.name}`
        );
      } else if (this._haveEnoughMoney(vendor, numberOfIceCreams) === false) {
        console.log(
          `Customer ${this.name} does not have enough money to buy ${numberOfIceCreams} ice creams from vendor ${vendor.name}`
        );
      }
    }
  };
}

const vendorAziz = new Vendor("Aziz", 10, 10);

const nearbyCustomer = new Customer("MishMish", 11, 11);
const distantCustomer = new Customer("Hamza", 1000, 1000);
const brokeCustomer = new Customer("Maskeen", 12, 12);

brokeCustomer.wallet.money = 0;

console.log(nearbyCustomer._isInRange(vendorAziz)); // true
console.log(distantCustomer._isInRange(vendorAziz)); // false
console.log(brokeCustomer._isInRange(vendorAziz)); // true

console.log("**************************************");

console.log(nearbyCustomer._haveEnoughMoney(vendorAziz, 10)); // true
console.log(distantCustomer._haveEnoughMoney(vendorAziz, 10)); // true
console.log(brokeCustomer._haveEnoughMoney(vendorAziz, 10)); // false

console.log("**************************************");

console.log(nearbyCustomer.wallet.money); // 10
console.log(vendorAziz.location); // { x: 10, y: 10 }

console.log("**************************************");

nearbyCustomer.requestIceCream(vendorAziz, 10); // fulfills conditions
distantCustomer.requestIceCream(vendorAziz, 10); // Customer Hamza is out of range of vendor Aziz
brokeCustomer.requestIceCream(vendorAziz, 10); // Customer Maskeen does not have enough money to buy 10 ice creams from vendor Aziz

console.log("**************************************");

console.log(vendorAziz.location); // Vendor's location changed fron { x: 10, y: 10 } to the customer's location which is: { x: 11, y: 11 }
console.log(vendorAziz.wallet.money); // 10
console.log(nearbyCustomer.wallet.money); // 0

// export { Point, Wallet, Person, Customer, Vendor };
/***********************************************************
 * If you want examples of how to use the
 * these classes and how to test your code manually,
 * check out the README.md file
 ***********************************************************/
