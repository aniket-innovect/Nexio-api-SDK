// import axios from 'axios';
// import fetch from 'fetch';
// const builtinModules = require('builtin-modules');
// import builtinModules from 'builtin-modules';
// console.log(builtinModules);
import fetch from 'node-fetch';

export namespace Nexio {


    let auth: string;

    const sandboxBaseUrl = "https://api.nexiopaysandbox.com/";
    const productType = "pay/";
    const apiVersion = "v3/"
    const oneTimeTokenUrl = 'token';
    const saveCardTokenUrl = "saveCard";
    const cardTransactionUrl = "process";
    const corsUrl = 'http://cors-anywhere.herokuapp.com/';
    const nexioNodeServiceUrl = 'http://localhost:3100/api/nexio/pay/v3';
    // const pub_key='MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvWpIQFjQQCPpaIlJKpegirp5kLkzLB1AxHmnLk73D3TJbAGqr1QmlsWDBtMPMRpdzzUM7ZwX3kzhIuATV4Pe7RKp3nZlVmcrT0YCQXBrTwqZNh775z58GP2kZs+gVfNqBampJPzSB/hB62KkByhECn6grrRjiAVwJyZVEvs/2vrxaEpO+aE16emtX12RgI5JdzdOiNyZEQteU6zRBRJEocPWVxExaOpVVVJ5+UnW0LcalzA+lRGRTrQJ5JguAPiAOzRPTK/lYFFpCAl/F8wtoAVG1c8zO2NcQ0Pko+fmeidRFxJ/did2btV+9Mkze3mBphwFmvnxa35LF+Cs/XJHDwIDAQAB';
    export interface requestHeaders {
        accept: string;
        'content-type': string;
        authorization: string;
    };

    export interface AppInfo {
        name: string;
        partner_id?: string;
        url?: string;
        version?: string;
    }
    export interface processingOptions {
        checkFraud?: boolean;
        verboseResponse?: boolean;
        verifyAvs?: number;
        verifyCvc?: boolean;
        check3ds?: boolean;
        saveCardToken?: boolean;
        retryOnSoftDecline?: boolean;
        shouldUseFingerprint?: boolean;
    };

    export interface data {
        currency?: string;
        customer?: customer;
        customFields?: customFields;
        amount?: number;
    };

    export interface customer {
        billToAddressOne: string;
        billToAddressTwo: string;
        billToCity: string;
        billToCountry: string;
        billToPhone: string;
        billToPostal: string;
        billToState: string;
        birthDate: string;
        createdAtDate: string;
        customerRef: string;
        email: string;
        firstName: string;
        invoice: string;
        lastName: string;
        orderNumber: string;
        phone: string;
        shipToAddressOne: string;
        shipToAddressTwo: string;
        shipToCity: string;
        shipToCountry: string;
        shipToPhone: string;
        shipToPostal: string;
        shipToState: string;
    };

    export interface customFields {
        exampleKey: string;
        exampleRefNumber: string;
    };

    export interface card {
        cardHolderName: string;
        encryptedNumber?: string;
        expirationMonth: string;
        expirationYear: string;
        cardType?: string;
        securityCode?: number;
        firstSix?: string;
        lastFour?: string;
    };

    export interface tokenex {
        token: string;
        firstSix?: string;
        lastFour?: string;
    }
    //TODO check the mandatory fields...
    export interface HideBilling {
        hideAddressOne: boolean;
        hideAddressTwo: boolean;
        hideCity: boolean;
        hideCountry: boolean;
        hidePostal: boolean;
        hidePhone: boolean;
        hideState: boolean;
    };

    //TODO check the required fields...
    export interface uiOptions {
        displaySubmitButton: boolean;
        hideBilling: HideBilling;
        hideCvc: boolean;
        requireCvc: boolean;
        forceExpirationSelection: boolean;
    };

    export class NexioApi {
        processingOptions: processingOptions;
        requestHeaders: requestHeaders;
        data: data;
        iFrameData: data;
        shouldUpdateCard: boolean;
        merchantId: string;
        tokenex: tokenex;
        shouldReturnHtml: boolean;
        uiOptions: uiOptions;
        isAuthOnly: boolean

        constructor(authorization: string) {
            auth = "Basic " + authorization;
            this.processingOptions = {
                checkFraud: true,
                verboseResponse: false,
                verifyAvs: 0,
                verifyCvc: false,
                check3ds: false,
                saveCardToken: true,
                retryOnSoftDecline: false,
                shouldUseFingerprint: true
            };
            this.requestHeaders = {
                accept: "application/json",
                "content-type": "application/json",
                authorization: auth,
            };
            this.data = {
                currency: 'USD',
                customer: {
                    billToAddressOne: '2147 West Silverlake Drive',
                    billToAddressTwo: 'Apt 42',
                    billToCity: 'Scranton',
                    billToCountry: 'US',
                    billToPhone: '1555555555',
                    billToPostal: '18503',
                    billToState: 'PA',
                    birthDate: '1990-12-05',
                    createdAtDate: '2005-03-01',
                    customerRef: 'RP006',
                    email: 'jdoe@example.com',
                    firstName: 'John',
                    invoice: 'IN0001',
                    lastName: 'Doe',
                    orderNumber: '210058A',
                    phone: '1555555555',
                    shipToAddressOne: '1725 Slough Avenue',
                    shipToAddressTwo: 'Suite 200',
                    shipToCity: 'Scranton',
                    shipToCountry: 'US',
                    shipToPhone: '1555555555',
                    shipToPostal: '18505',
                    shipToState: 'PA'
                },
                customFields: { exampleKey: 'Example string', exampleRefNumber: '094785' },
                amount: null
            };
            this.shouldUpdateCard = true;
            this.merchantId = "301307";
            this.shouldReturnHtml = false;
            let hideBilling = {
                hideAddressOne: false,
                hideAddressTwo: false,
                hideCity: false,
                hideCountry: false,
                hidePostal: false,
                hidePhone: true,
                hideState: false,
            }
            this.uiOptions = {
                displaySubmitButton : false,
                forceExpirationSelection : true,
                hideCvc: false,
                requireCvc: true,
                hideBilling: hideBilling
            }
            this.isAuthOnly = false;
        };

        updateProcessingOptions(key: string, value: any) {
            if (this.processingOptions.hasOwnProperty(key)) {
                this.processingOptions[key] = value;
            } else {
                return new Error("There is no such property in processing option.Please refer the api documentation");
            }

        };

        updateDataobject(key: string, value: any) {
            if (this.data.hasOwnProperty(key)) {
                this.data[key] = value;
            }
            else {
                return new Error("There is no such property in data object. Please refer the api documentation");
            }
        };

        updateShouldUpdateCard(value: boolean) {
            this.shouldUpdateCard = value;
        };

        setMerchantId(merchantId: string) {
            this.merchantId = merchantId;
        };
        setTokenEx(tokenex: tokenex) {
            this.tokenex = tokenex;
        }

    };

    export async function saveCardOneTimeTokenApi(nexioApi: NexioApi) {
        let method: string = "POST";
        console.log('method', method);
        let nexioUrl: string = sandboxBaseUrl + productType + apiVersion + oneTimeTokenUrl;
        let requestUrl: string = nexioNodeServiceUrl + '/token';
        console.log('requestUrl', nexioUrl);

        let dataObj: any = {
            data: nexioApi.data,
            url: nexioUrl,
            processingOptions: nexioApi.processingOptions
        }

        let options: any = {
            method: method,
            headers: nexioApi.requestHeaders,
            // data: dataObj
            body: JSON.stringify(dataObj)
        };
        console.log('options', options);

        try {
            const response = await fetch(requestUrl, options);
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
            const result = (await response.json())
            console.log('result is: ', JSON.stringify(result));
            return result;
        } catch (error) {
            if (error instanceof Error) {
                console.log('error message: ', error.message);
                return error.message;
            } else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }

    };

    export async function saveCardIFrameFn(token: string, nexioApi: NexioApi) {
        var iframeBaseUrl = "https://api.nexiopaysandbox.com/pay/v3/saveCard";
        var oneTimeUseToken = "?token=" + token;
        var returnHtml = "&shouldReturnHtml=" + nexioApi.shouldReturnHtml;
        var saveCardUrl = iframeBaseUrl + oneTimeUseToken + returnHtml;
        return saveCardUrl;
    }

    export async function oneTimeIFrameTokenApi(nexioApi: NexioApi) {
        let method: string = "POST";
        let nexioUrl: string = sandboxBaseUrl + productType + apiVersion + oneTimeTokenUrl;
        let requestUrl: string = nexioNodeServiceUrl + '/iToken';

        let dataObj: any = {
            data: nexioApi.data,
            url: nexioUrl,
            processingOptions: nexioApi.processingOptions,
            uiOptions: nexioApi.uiOptions,
            isAuthOnly: nexioApi.isAuthOnly,
            shouldUpdateCard: nexioApi.shouldUpdateCard
        }

        let options: any = {
            method: method,
            headers: nexioApi.requestHeaders,
            body: JSON.stringify(dataObj)
        };
        console.log('options', options);

        try {
            const response = await fetch(requestUrl, options);
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
            const result = (await response.json())
            console.log('result is: ', JSON.stringify(result));
            return result;
        } catch (error) {
            if (error instanceof Error) {
                console.log('error message: ', error.message);
                return error.message;
            } else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    }

    export async function cardTransIFrameFn(token: string, nexioApi: NexioApi) {
        var iframeBaseUrl = "https://api.nexiopaysandbox.com/pay/v3";
        var oneTimeUseToken = "?token=" + token;
        var returnHtml = "&shouldReturnHtml=" + nexioApi.shouldReturnHtml;
        var runCardUrl = iframeBaseUrl + oneTimeUseToken + returnHtml;
        return runCardUrl;
    }
}