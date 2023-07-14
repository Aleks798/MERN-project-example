db.createUser(
    {
        user: "root",
        pwd: "example",
        roles: [
            {
                role: "readWrite",
                db: "mernProject"
            }
        ]
    }
);
db.createCollection("test"); //MongoDB creates the database when you first store data in that database