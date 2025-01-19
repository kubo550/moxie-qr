import {
    Heading,
} from '@chakra-ui/react';
import {ProductItem} from "./ProductItem";
import {Product} from "../../domain/products";

interface ProductListProps {
    products: Product[];
}

export const ProductList = ({products}: ProductListProps) => {

    return (
        <>
            <Heading as="h1">
                Your Awesome MOXIE Items
            </Heading>

            {
                products.map(product => (
                    <ProductItem product={product} key={product.codeId} />
                ))
            }

        </>
    )
}


