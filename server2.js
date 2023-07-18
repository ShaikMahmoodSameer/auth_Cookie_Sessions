const func = async () => {
    var fruits = ["apples", "oranges", "mango"];
    var veggies = ["carrots", "onions", "brocoli"];

    var grocs = await [...fruits, ...veggies]
    console.log(grocs);
}

function func2(){
    console.log("function 2 execution");
}


func();
func2();