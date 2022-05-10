import './App.css';

const Objectives= () =>
{
    return(
        <>
        <div className="bg1">
            <div id="indigo">
                <p>
                Blockchain has become an emerging technology and with blockchain, the concept of decentralization has also emerged which allows users to store the data decentralized. 
                In order to maintain transparency and making it difficult or impossible to change or hack the ownership of NFTs. 
                This NFT – Platform is created where people can create, sell and buy digital assets (NFT) whose complete data will be stored in the Ethereum Blockchain and complete transaction details can be easily viewed on the blockchain.
                <br></br><br></br>
                The objectives of this Platform are: <br></br>
                    <ul>
                        <li>To provide a platform where people can create/mint digital assets as NFT like art, gifs, etc.</li>
                        <li>To provide a platform where people can see the NFTs and buy them if they like.</li>
                        <li>All the operations performed on the platform will be stored in Blockchain to maintain proper transparency.</li>
                    </ul>
                </p>
            </div>
            <footer>
                <div className="about">
                        <h3>About</h3>
                        <ul>
                            <li> <a href="About" id="noline"> About Us</a></li>
                            <li> <a href="Objectives" id="noline"> Objectives</a></li>
                        </ul>
                </div>
                <div className="mail">
                    <h3>Mail Us</h3>
                    <p>nftplatform@gmail.com</p><br></br>
                </div>
                <div className="office">
                    <h3>Registered Office</h3>
                    <p>Computer-Science Block,<br></br> 
                    Medi-Caps University <br></br>
                    <br></br>
                    A.B. Road, Pigdamber, Rau <br></br>
                    Indore - 453331</p>
                    </div>
            </footer>
        </div>
        </>
    );
}

export default Objectives;