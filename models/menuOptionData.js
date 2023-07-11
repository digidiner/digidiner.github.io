class menuOptionData {
    static async connectDatabase(conn) {
        this.conn = conn;
        conn.query(`
            CREATE TABLE IF NOT EXISTS full_menu_options
            (
                id           INT(11)      NOT NULL AUTO_INCREMENT,
                name         VARCHAR(255) NOT NULL,
                description  TEXT,
                choices      INT,
                full_menu_id INT(11)      NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (full_menu_id) REFERENCES full_menu (id) ON DELETE CASCADE
            )`);
    }

    static async getAllMenuOption() {
        console.log("you are here");
        return await menuOptionData.conn.query('SELECT * FROM full_menu_options');
    }

    // Get individual menu item
    static async getMenuOption(id) {
        const queryResult = await menuOptionData.conn.query('SELECT * FROM full_menu_options WHERE id = ?', [id]);
        if (queryResult.length > 0) {
            return queryResult[0];
        } else {
            return null;
        }
    }

    static async addMenuOption(item) {
        const { name, description, choices, full_menu_id } = item;
        console.log("full_men_id", full_menu_id);
        const queryResult = await menuOptionData.conn.query('INSERT INTO full_menu_options (name, description, choices, full_menu_id) ' +
            'VALUES (?, ?, ?, ?)', [name, description, choices, full_menu_id]);
        const insertedId = queryResult.insertId;
        return {id: insertedId, name, description, choices, full_menu_id};
    }

    static async updateMenuOption(id, newData) {
        let updateFields = [];
        let queryParams = [];

        // Construct the update fields and corresponding query parameters
        if (newData.name !== undefined) {
            updateFields.push('name = ?');
            queryParams.push(newData.name);
        }
        if (newData.description !== undefined) {
            updateFields.push('description = ?');
            queryParams.push(newData.description);
        }

        if (newData.choices !== undefined) {
            updateFields.push('choices = ?');
            queryParams.push(newData.choices);
        }

        const sql = `UPDATE full_menu_options SET ${updateFields.join(', ')} WHERE id = ?`;
        queryParams.push(id);

        const queryResult = await menuOptionData.conn.query(sql, queryParams);
        return queryResult.affectedRows > 0;
    }

    static async removeMenuOption(id) {
        const queryResult = await menuOptionData.conn.query('DELETE FROM full_menu_options WHERE id = ?', [id]);
        return queryResult.affectedRows > 0;
    }

    // Helper function to check if the option exists
    static async checkOptionExists(optionId) {
        const query = 'SELECT id FROM full_menu_options WHERE id = ?';
        const [rows] = await menuOptionData.conn.query(query, [optionId]);
        return rows.length > 0;
    };
}

module.exports = menuOptionData;

