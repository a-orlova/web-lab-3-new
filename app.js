export default function (express, bodyParser, createReadStream, crypto, http) {
    const app = express();
    const login = "alenaorlova";

    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET,POST,PUT,PATCH,OPTIONS,DELETE",
        );
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, ngrok-skip-browser-warning",
        );
        next();
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.all("/login/", (req, res) => {
        res.send(login);
    });

    app.all("/code/", (req, res) => {
        createReadStream(import.meta.url.substring(7)).pipe(res);
    });

    app.all("/sha1/:input/", (req, res) => {
        res.send(
            crypto.createHash("sha1").update(req.params.input).digest("hex"),
        );
    });

    app.all("/req/", (req, res) => {
        const addr = req.method === "POST" ? req.body.addr : req.query.addr;

        if (!addr) {
            return res.send("");
        }

        http.get(addr, (response) => {
            let data = "";
            response.on("data", (chunk) => {
                data += chunk;
            });
            response.on("end", () => {
                res.send(data);
            });
        }).on("error", () => {
            res.send("error");
        });
    });

    app.all("*", (req, res) => {
        res.send(login);
    });

    return app;
}
