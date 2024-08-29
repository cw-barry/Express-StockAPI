# STOCK MANAGEMENT API

### ERD:

![ERD](./erdStockAPI.png)

### ERD-2 (snake_case):

![ERD](./erdStockAPI2.png)

### Folder/File Structure:

```
    .env
    .gitignore
    index.js
    package.json
    readme.md
    src/
        config/
            dbConnection.js
            swagger.json
        controllers/
            auth.js
            brand.js
            category.js
            firm.js
            product.js
            purchase.js
            sale.js
            token.js
            user.js
        helpers/
            passwordEncrypt.js
            sendMail.js
        middlewares/
            authentication.js
            errorHandler.js
            findSearchSortPage.js
            logger.js
            permissions.js
            upload.js
        models/
            brand.js
            category.js
            firm.js
            product.js
            purchase.js
            sale.js
            token.js
            user.js
        routes/
            auth.js
            brand.js
            category.js
            document.js
            firm.js
            index.js
            product.js
            purchase.js
            sale.js
            token.js
            user.js
```

* SESSION-1

    * Model -> Controller -> Router
        * User
            * Password & Email Validation
            * Do test before next model
        * Token
        * Brand
        * Category
        * Firm
        * Product
        * Purchase
        * Sale

    * Controller -> Auth
        * Login
        * Logout

    * Middlewares -> Authentication
        * Check Token

    * Controller -> User
        * Add create token to user.create
            ```js
            // Create token for auto-login:
            const tokenData = await Token.create({ user_id: data._id, token: passwordEncrypt(data._id + Date.now()) })
            ```
        * Read & Update:
            ```js
            //...
            // Only self-record:
            filter = (req?.user && !req.params?.id) ? { _id: req.user._id } : { _id: req.params.id }
            const data = await User.findOne(filter)
            //...
            ```

    * Controller -> Product & Purchase & Sale -> list & read
        * populate

* SESSION-2

    * Middlewares -> Permissions
        * Router permissions

    * At Controller/Purchase:
        * at create -> Add userId to req.body from req.user
            ```js
            // Auto add user_id to req.body:
            req.body.user_id = req.user?._id
            ```
        * Update current stock quantity for Product:
            * on Create
            * on Update
            * on Delete

    * At Controller/Sale:
        * at create -> Add userId to req.body from req.user
            ```js
            // Auto add user_id to req.body:
            req.body.user_id = req.user?._id
            ```
        * Update current stock quantity for Product:
            * Check enough stock before sale
            * on Create
            * on Update
            * on Delete
            
    * SimpleToken & JWT

* SESSION-3

    * Connect Frontend to Backend
        * Backend:
            * CORS -> index.js
                ```sh
                npm i cors
                ```
                ```js
                // CORS
                // https://expressjs.com/en/resources/middleware/cors.html
                // const cors = require('cors')
                // app.use(cors())
                app.use(require('cors')())
                ```
            * Routes re-design:
                ```js
                // auth:
                router.use('/account/auth', require('./auth'))

                // brand:
                router.use('/stock/brands', require('./brand'))
                // category:
                router.use('/stock/categories', require('./category'))
                // firm:
                router.use('/stock/firms', require('./firm'))
                // product:
                router.use('/stock/products', require('./product'))
                // purchase:
                router.use('/stock/purchases', require('./purchase'))
                // sale:
                router.use('/stock/sales', require('./sale'))
                ```
        * Frontend:
            * rename "_env_frontend" to ".env"
            * remove "AdminPanel" link from "components/MenuListItems"
            * add valueGetter to table-data for nested-data
                * "components/ProductTable":
                    ```js
                    // ...
                    field: "category",
                    valueGetter: (params) => params.row.category_id?.name,
                    // ...
                    field: "brand",
                    valueGetter: (params) => params.row.brand_id?.name,
                    // ...
                    ```
                * "components/PurchaseTable":
                    ```js
                    // ...
                    field: "firm",
                    valueGetter: (params) => params.row.firm_id?.name,
                    // ...
                    field: "brand",
                    valueGetter: (params) => params.row.brand_id?.name,
                    // ...
                    field: "product",
                    valueGetter: (params) => params.row.product_id?.name,
                    // ...
                    // ...
                    // setInfo({ id, firm_id, brand_id, product_id, quantity, price })
                    setInfo({ id, firm_id: firm_id._id, brand_id: brand_id._id, product_id: product_id._id, quantity, price })
                    // ...
                    ```
                * "components/SaleTable":
                    ```js
                    // ...
                    field: "brand",
                    valueGetter: (params) => params.row.brand_id?.name,
                    // ...
                    field: "product",
                    valueGetter: (params) => params.row.product_id?.name,
                    // ...
                    // ...
                    // setInfo({ id, brand_id, product_id, quantity, price })
                    setInfo({ id, brand_id: brand_id._id, product_id: product_id._id, quantity, price })
                    // ...
                    ```
            * change Number(id) to id:
                * "components/PurchaseModal" & "components/SaleModal":
                    ```js
                    // ...
                    // setInfo({ ...info, [name]: Number(value) })
                    setInfo({ ...info, [name]: (value) })
                    // ...
                    ```
    * Extras:
        * You can add "productCount" for Category and Brand.
        * list products of brand
        * list products of category
        * list sales of product
        * list purchases of product
        * list purchases of firm

---
Finished :)