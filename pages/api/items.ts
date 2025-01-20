import {NextApiResponse} from "next";
import {getCustomerByEmail} from "../../infrastructure/firebase";
import {use} from 'next-api-route-middleware';
import {NextApiRequestWithUser, validateMethod, validateUser} from "../../utils/validateUser";
import {Product, ProductSource} from "../../domain/products";


export default use(validateMethod('GET'), validateUser, async (
    req: NextApiRequestWithUser,
    res: NextApiResponse,
) => {
    try {
        const email = req.headers.email;
        const source = req.query.source as ProductSource;

        const customer = await getCustomerByEmail(email);

        if (!customer) {
            // res.status(404).json({message: 'Customer not found'});
            res.status(200).json({items: [], customerId: null});
            return;
        }

        const items = customer.items.filter((item: Product) => item.source === source)

        const currentHrAndMn = `${new Date().getHours()}:${new Date().getMinutes()}`
        res.status(200).json({items, customerId: customer.id, currentHrAndMn});

    } catch (e) {
        console.error(e)
        return res.status(500).json({})
    }
});