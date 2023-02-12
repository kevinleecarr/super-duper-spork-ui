import React, {useState} from 'react'
import {DataList} from "@/components/genericViews/dataList";
import {Container} from "@mantine/core";
import CreateCustomer from "@/pages/customers/create";

const CustomersPage = () => {
    const [refreshCount, setRefreshCount] = useState(0);
    const updatePage = () => {
        console.log(refreshCount);
        setRefreshCount(refreshCount + 1);
    }

    const sporkApiBaseUrl = process.env.SPORK_API_BASE_URL;

    return (
        <Container>
            <CreateCustomer updatePage={updatePage}/>
            <DataList
                key={refreshCount}
                name={"Customers"}
                endpoint={sporkApiBaseUrl + '/api/v1/customers'}
                columns={[
                    {name: 'Name', key: 'name'},
                    {name: 'Subdomain', key: 'subdomain'},
                    {name: 'SKUs', key: 'oktaSkus'},
                ]}/>
        </Container>
    );
}

export default CustomersPage