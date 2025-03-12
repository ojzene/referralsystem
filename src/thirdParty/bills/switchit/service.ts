import fetch from 'node-fetch';

export class SwitchITService {
    BASE_URL = "https://demo.etranzact.com/switchitbillpayment/api/v1";

    GET_OPTIONS = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'terminalId': '7000000001',
            'pin': 'kghxqwveJ3eSQJip/cmaMQ==',
            'X-FORWARDED-FOR': '72.32.159.193, 60.91.3.17'
        }
    }


    public getBillCategory = async () => {
        let categoryResponse = await this.makeRequest(this.BASE_URL+'/biller-category', this.GET_OPTIONS);
        console.log("category---> ", categoryResponse);
        if(categoryResponse && categoryResponse.data) {
            return categoryResponse.data.result;
        } else {
            return categoryResponse.error;
        }
    }

    public getBillerByCategory = async (categoryId: number) => {
        let categoryResponse = await this.makeRequest(this.BASE_URL+'/biller/category/'+categoryId, this.GET_OPTIONS);
        console.log("biller by category---> ", categoryResponse);
        if(categoryResponse && categoryResponse.data) {
            return categoryResponse.data.result;
        } else {
            return categoryResponse.error;
        }
    }
    
    public getBillerServiceType = async (billId: number) => {
        let response = await this.makeRequest(this.BASE_URL+'/service-type/biller/'+billId, this.GET_OPTIONS);
        console.log("serviceResponse---> ", response);
        if(response && response.data) {
            return response.data.result;
        } else {
            return response.error;
        }
    }

    public getBillPaymentStatus = async (paymentRef: any) => {
        let response = await this.makeRequest(this.BASE_URL+'/bill-status/'+paymentRef, this.GET_OPTIONS);
        console.log("statusResponse---> ", response);
        if(response && response.data) {
            return response.data.result;
        } else {
            return response.error;
        }
    }

    public postBillQuery = async (billId: any, clientRef: any, customerId: any) => {
        let requestBody = {
            billId,
            clientRef,
            customerId
        };

        let options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'terminalId': '7000000001',
                'pin': 'kghxqwveJ3eSQJip/cmaMQ==',
                'X-FORWARDED-FOR': '72.32.159.193, 60.91.3.17'
            },
            body: JSON.stringify(requestBody)      
        }

        let response = await this.makeRequest(this.BASE_URL+'/bill-query', options);
        console.log("postBillResponse---> ", response);
        if(response && response.data) {
            return response.data;
        } else {
            return response.error;
        }
    }
    
    public postBillPayment = async (clientRef: any, billQueryRef: any, billId: any, customerId: any, amount: number, productId: any) => {
        let requestBody =  {
            clientRef, 
            billQueryRef,
            billId,
            customerId,
            amount,
            productId
        }

        let options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'terminalId': '7000000001',
                'pin': 'kghxqwveJ3eSQJip/cmaMQ==',
                'X-FORWARDED-FOR': '72.32.159.193, 60.91.3.17'
            },
            body: JSON.stringify(requestBody)      
        }

        let response = await this.makeRequest(this.BASE_URL+'/bill-payment', options);
        console.log("postPaymentResponse---> ", response);
        if(response && response.data) {
            return response.data;
        } else {
            return response.error;
        }
    }


    public getAllBillerByCategory = async () => {
        let catArr = [1,2,3,4,5,6,7];
        try {
            let catResponse = catArr.map(async (eachCat) => { 
                let response = await this.makeRequest(this.BASE_URL+'/biller/category/'+eachCat, this.GET_OPTIONS);
                if(response && response.data) {
                    return response.data.result;
                }
            });
           
            if(catResponse && catResponse.length > 0) {
                let result = await Promise.all(catResponse);
                let getAllFlat = result.flat();
                return getAllFlat;
            } else {
                console.log("category response error---> ", catResponse);
                return null;
            }


        } catch (err) {
            return err;
        }

        // if(categoryResponse && categoryResponse.data) {
        //     return categoryResponse.data.result;
        // } else {
        //     return categoryResponse.error;
        // }
    }
 



    public makeRequest = async (url: any, options: any, body=null) => {
        let k = await fetch(url, options);
        let response = await k.json();
        try {
            return { data: response, error: null }
        } catch(err) {
            return { data: null, error: err }
        }
    }

}
