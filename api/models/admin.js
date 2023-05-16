const database = require('../db/connection');

class Admin {

    constructor(admin_name, password, is_super) {

        this.admin_name = admin_name;
        this.password = password;
        this.is_super = is_super;

}

 static create(admin) {
    const query = {
      text: 'INSERT INTO admins (admin_name, password, is_super) VALUES ($1, $2, $3) RETURNING *',
      values: [admin.admin_name, admin.password, admin.is_super]
    };

    return database.pool.query(query);
  }


}

module.exports = Admin;