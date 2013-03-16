from flask import Flask, session, redirect, url_for, escape, request, abort, render_template
import json

app = Flask(__name__)

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


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=80)
