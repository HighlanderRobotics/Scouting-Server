/**
 * Abstract Class Animal.
 *
 * @class Animal
 */
 class Animal {

    constructor() {
        if (this.constructor == Animal) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }
  
    say() {
        throw new Error("Method 'say()' must be implemented.");
    }
  
    eat() {
        console.log("eating");
    }
  }

class Dog extends Animal {

    constructor(a) {
        super()
        this.age = a;
    }

    static name = "Dog"
    say() {
        console.log("bark " + this.age);
    }
 }
 
class Cat extends Animal {
    static name = "Cat"

    say() {
        console.log("meow");
    }
 }

class Horse extends Animal {
    static name = "Horse"

    say() {
        console.log("neigh");
    }
   
}

// register algo here
var all_algos = [ Dog.name, Cat.name, Horse.name]






var animals = []
animals.push(new Dog(2));
animals.push(new Cat());
animals.push(new Horse());

animals.forEach((animal) => {

//    animals.get_data()
//    animals.run()

    animal.say()
})


// animals.forEach((animal) => {
//     animal.finalize()
// })
    




