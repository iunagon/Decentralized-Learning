import React, { Component } from 'react';
import { convertBytes } from './helpers';
import moment from 'moment'
import 'bootstrap/dist/css/bootstrap.min.css';
class Main extends Component {
  viewFile = async (fileHash) => {
    // Replace 'YOUR_BEARER_TOKEN' with your actual bearer token
    const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhBNjA4YmJiYjcwNDExRDExODJiQThERWRDRjNGMkFGY0FmQTg2NTQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MTA0NjcwMzk4NiwibmFtZSI6ImRjcF9wcm9qZWN0In0.Ze23yTsnuqwYb2dg4TV4KuEvcHFq8ysVHRYW4oo2w9k';
  
    // Construct the download URL with the file hash (CID) and bearer token
    const downloadUrl = `https://${fileHash}.ipfs.nftstorage.link?token=${bearerToken}`;
  
    window.open(downloadUrl, '_blank');
  };
  render() {
    
    return (
      
      <div className="container-fluid mt-5 text-center mx-auto" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
            <div className="content">
              <p>&nbsp;</p>
              <h1>Journals and Publications</h1>
              <div className="card mb-3 mx-auto bg-dark text-center" style={{ maxWidth: '512px' }}>
                <h2 className="text-white text-monospace bg-dark"><b><ins>Share Journals</ins></b></h2>
                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const description = this.fileDescription.value
                    this.props.uploadFile(description)
                  }} >
                      <div className="form-group">
                        <br></br>
                          <input
                            id="fileDescription"
                            type="text"
                            ref={(input) => { this.fileDescription = input }}
                            className="form-control text-monospace"
                            placeholder="description..."
                            required />
                      </div>
                      <br></br>
                    <input type="file" onChange={this.props.captureFile} className="text-white text-monospace"/>
                    <button type="submit" className="btn-primary btn-block"
                     style={{
    borderRadius: '10px', // Apply rounded corners
    backgroundColor: 'white', // Set background color to white
    color: 'black' // Set text color to black
  }}><b>Upload!</b></button>
                   
                  </form>
                  <br></br>
              </div>
              {/* Creatining uploading card ... */}
                {/* Uploading file... */}
              <p>&nbsp;</p>
              {/* Create Table*/}
              <table className="table-sm table-bordered text-monospace" style={{ width: '1000px', maxHeight: '450px'}}>
                <thead style={{ 'fontSize': '15px' }}>
                  <tr className="bg-dark text-white">
                    <th scope="col" style={{ width: '10px'}}>id</th>
                    <th scope="col" style={{ width: '200px'}}>name</th>
                    <th scope="col" style={{ width: '230px'}}>description</th>
                    <th scope="col" style={{ width: '120px'}}>type</th>
                    <th scope="col" style={{ width: '90px'}}>size</th>
                    <th scope="col" style={{ width: '90px'}}>date</th>
                    <th scope="col" style={{ width: '120px'}}>uploader/view</th>
                    <th scope="col" style={{ width: '120px'}}>hash/view/get</th>
                  </tr>
                </thead>
                { this.props.files.map((file, key) => {
                  return(
                    <thead style={{ 'fontSize': '12px' }} key={key}>
                      <tr>
                        <td>{file.fileId}</td>
                        <td>{file.fileName}</td>
                        <td>{file.fileDescription}</td>
                        <td>{file.fileType}</td>
                        <td>{convertBytes(file.fileSize)}</td>
                        <td>{moment.unix(file.uploadTime).format('h:mm:ss A M/D/Y')}</td>
                        <td>
                          <a
                            href={"https://etherscan.io/address/" + file.uploader}
                            rel="noopener noreferrer"
                            target="_blank">
                            {file.uploader.substring(0,10)}...
                          </a>
                         </td>
                        <td>
                        <button
            onClick={() => this.viewFile(file.fileHash)}
            className="btn btn-primary"
          >
            View 
          </button>
                        </td>
                      </tr>
                    </thead>
                  )
                })}
              </table>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;