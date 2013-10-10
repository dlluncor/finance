from flask import Flask, session, redirect, url_for, escape, request, abort, render_template
import json
import urllib2

app = Flask(__name__)

xml_string = '''<?xml version="1.0" encoding="utf-8"?>
<PurchaseRequest>
        <MerchantIdentity>
                <ClientId>000091095650</ClientId>
                <AcquiringInstitutionId>1340</AcquiringInstitutionId>
                <CardAcceptorTerminalId>001</CardAcceptorTerminalId>
        </MerchantIdentity>
        <!--<MerchantTransactionTimestamp>2012-01-06T09:30:47Z</MerchantTransactionTimestamp>-->
        <MerchantTransactionTimestamp>2009-12-10T16:34:51.185+11:00</MerchantTransactionTimestamp>
        <Industry>MOTO</Industry>
        <FundingCard>
                <AccountNumber>4417122900000002</AccountNumber>
                <MaskedAccount>false</MaskedAccount>
                <ExpiryMonth>12</ExpiryMonth>
                <ExpiryYear>12</ExpiryYear>
                <SecurityCode>382</SecurityCode>
                <Address>
                        <Line1>100</Line1>
                        <Line2/>
                        <City/>
                        <CountrySubdivision/>
                        <PostalCode>33606</PostalCode>
                        <Country>USA</Country>
                </Address>
        </FundingCard>
        <ClientReference>12345678901234567</ClientReference>
        <!--Optional, upto 11 alpha-numeric characters-->
        <SettlementDraftLocatorId>1234567890a</SettlementDraftLocatorId>
        <Amount>
                <Currency>USD</Currency>
                <Value>1540</Value>
        </Amount>
        <Authentication>
                <EcommerceIndicator>5</EcommerceIndicator>
                <TransactionId>Q0JLSkIyODlWMVBaTDRURFhYV0Y=</TransactionId>
                <Token>Q0JLSkIyODlWMVBaTDRURFhYV0Y=</Token>
        </Authentication>
</PurchaseRequest>'''

@app.route('/')
def home():
    return 'It works'

@app.route('/execution', methods=['GET', 'POST'])
def execution_handler():
    if request.method == 'POST':
        # process the json rpc request from client
        request_data = json.loads(request.data)
        params = request_data['params']

        # Execution algorithm
    return 'Hello EasilyDo\n'


def payments():
        url = "http://dmartin.org:12181/payments/v3/purchase"
        print "hello"    
        req = urllib2.Request(url=url, 
                      data=xml_string, 
                      headers={'Content-Type': 'application/xml'})
        response = urllib2.urlopen(req)
        print response.read()

if __name__ == '__main__':
    app.debug = True
    payments()    
    app.run(host='0.0.0.0', port=80)


