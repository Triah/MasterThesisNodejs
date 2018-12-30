class User{
    constructor(name, age){
        this.name = name;
        this.age = age;
    }
}

class Student extends User{
    constructor(name, age, teacher, actions){
        super(name, age);
        this.teacher = teacher;
        this.actions = actions;
    }
}

class Teacher extends User{
    constructor(name, age, studentList){
        super(name, age);
        this.studentList = studentList;
    }
}