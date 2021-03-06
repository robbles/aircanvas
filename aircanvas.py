#! /usr/bin/python


from BaseHTTPServer import HTTPServer
from SimpleHTTPServer import SimpleHTTPRequestHandler
import cgi
import urllib

STARTDIR = '/home/rob/canvasapp/'

class CanvasHTTPHandler(SimpleHTTPRequestHandler):
    """
    An HTTP handler for the backend of the canvas app. The javascript client can
    send it the canvas image in base64 encoding, and it writes it to a PNG file.
    This image file is then fetched as the initial background to the canvas on the
    next load of the app. 

    NOTE: do_GET is handled by SimpleHTTPRequestHandler, this just defines do_POST
    """

    def do_POST(self):
        try:
            # Parse the form data posted
            form = cgi.FieldStorage(fp=self.rfile, 
                                    headers=self.headers,
                                    environ={'REQUEST_METHOD':'POST',
                                             'CONTENT_TYPE':self.headers['Content-Type']})

            #self.wfile.write('Client: %s\n' % str(self.client_address))
            #print '\n\n[POST]: Path: %s' % self.path
            #print 'length is ', len(form['canvas'].value)
            #print form['canvas'].value[:50]
            
            canvas = urllib.urlopen(form['canvas'].value).read()

            file2 = open('./canvas.png', 'w')
            file2.write(canvas)
            file2.close()
            

        except Exception, e:
            pass



if __name__ == '__main__':
    import os
    #print "Starting canvas server..."
    os.chdir(STARTDIR)
    try:
        http_server = HTTPServer(('', 80), CanvasHTTPHandler)
        http_server.serve_forever()
    except Exception, e:
        #print e
        #print "Couldn't start on port 80, trying again on port 8192"
        http_server = HTTPServer(('', 8192), CanvasHTTPHandler)
        http_server.serve_forever()









