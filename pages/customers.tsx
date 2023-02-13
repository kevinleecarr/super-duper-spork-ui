import React, { useEffect, useState } from 'react';
import {DataList} from "@/components/genericViews/dataList";
import {Container} from "@mantine/core";
import CreateCustomer from "@/pages/customers/create";
import axios from 'axios';

const CustomersPage = () => {
  const [refreshCount, setRefreshCount] = useState(0);
  const [entitledSkus, setEntitledSkus] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    let response = await axios.get(process.env.SPORK_API_BASE_URL
      + '/api/v1/account/entitledSkus');

    setEntitledSkus(response.data);
    updatePage();
  }

  const updatePage = () => {
    setRefreshCount(refreshCount + 1);
  }

  const sporkApiBaseUrl = process.env.SPORK_API_BASE_URL;

  const customersTransformer = (data: any) => {
    if (!entitledSkus) {
      return data;
    }
    return data?.map((customer: any) => {
      console.log(entitledSkus);
      return {...customer,
        oktaSkus : customer.oktaSkus.map((skuId: any) => {
          const sku: any = entitledSkus.find((e: any) => e.id === skuId);
          return sku?.name;
        })
      };
    });

  };

  return (
    <Container>
      <CreateCustomer updatePage={updatePage}/>
      <DataList
        key={refreshCount}
        name={"Customers"}
        endpoint={sporkApiBaseUrl + '/api/v1/customers'}
        transformer={customersTransformer}
        columns={[
          {name: 'Name', key: 'name'},
          {name: 'Subdomain', key: 'subdomain'},
          {name: 'SKUs', key: 'oktaSkus'},
        ]}/>
    </Container>
  );
}

export default CustomersPage