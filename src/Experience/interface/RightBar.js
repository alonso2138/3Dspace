import Experience from "../Main";

export default class RightBar {
    constructor() {
        this.experience = new Experience;

        this.isOpen = false; // Track if the right bar is open or closed

        this.selectedPieces = [];

        this.generateTopNav();
        this.injectStyles();
    }



    deleteRightBar() {
        const topnav = document.querySelector('.top-nav-wrapper');
        topnav.remove();
    }

    generateTopNav(){
        // Create top-nav div
        const topNav = document.createElement('div');
        topNav.className = 'top-nav';

        // Create top-nav wrapper
        const topNavWrapper = document.createElement('div');
        topNavWrapper.className = 'top-nav-wrapper';
        topNavWrapper.appendChild(topNav);

        // Create back button
        const backButton = document.createElement('button');
        backButton.className = 'back-button1';
        backButton.innerHTML = '←';
        backButton.addEventListener('click', () => {
            this.experience.restartExperience();
        });
        topNav.appendChild(backButton);

        // Create title div
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = this.experience.moto.model;
        topNav.appendChild(title);

        document.body.appendChild(topNavWrapper);
    }

    injectStyles() {
        const styles=
        `
        body {
            background-color: #f0f0f0;
            font-family: 'Arial', sans-serif;
            transition: filter 0.5s ease;

        }


        #notification{
            opacity:0;

            position: absolute;
            height: 1rem;
            width: 1rem;
            border-radius: 50%;
            background-color: red;

            transform: translate(320%, -100%);

            transition: opacity 0.5s ease;
        }

        .top-nav-wrapper {
            position: fixed;
            z-index: 2;
            top: 0;
            left: 0;
            right: 0;
            background-color: rgba(52, 73, 94, 1);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            height: 6rem;
            justify-content: center;
            width: 100%;
            align-items: center;
            display: flex;
        }

        .top-nav {
            max-width: 60rem;
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .top-nav button, .top-nav img, .top-nav .logo {
            color: #ffffff;
        }
        .top-nav .logo {
            font-size: 1.5rem;
            font-weight: bold;
        }
        .content {
            z-index: 2;
            opacity: 1;

            margin-top: 4rem;
            position: relative;
        }
        .title {
            color: #ffffff;
            text-decoration: underline;
            font-size: 1.5rem;
            font-weight: bold;
        }

        #Total {
            font-weight: bold;
        }

        .cost-box {
            display:flex;
            flex-direction: column;
            justify-content: center;
            width: auto;
            height: 100%;
            padding: 0 1rem;
            color: #fff;
            text-align: center;
            bottom: 0;
            transition: width 0.3s ease;
        }
        .cost-box button {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 0.5rem;
            color: rgba(0, 0, 0, 1);
            font-size: 1rem;
            cursor: pointer;
            padding: 0.5rem 1rem;
            border:none;
            border-radius: 0.5rem;
            
            background-color: rgba(255, 255, 255, 1);

            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

            transition: all 0.3s ease;
        }
        .cost-box button:hover {
            background-color: rgba(255, 255, 255, 0.8);
            color: rgba(52, 73, 94, 0.8);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
        }
        .cost-box button i {
            margin-right: 0.5rem;
            transition: transform 0.3s ease;
        }
        .cost-box button:hover i {
            transform: scale(1.2);
        }

        .back-button1 {
            margin-left: 1rem;
            font-size: 2rem;
            cursor: pointer;
            color: #333;
            background-color: rgba(255, 255, 255, 0);
            border: none;
            text-decoration: none;

            transition: all 0.3s ease;
        }

        .back-button1:hover{
            transform: scale(1.1);
        }


        .items-right{
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 1rem;
        }

        .user-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #3b82f6;
            background-image: url('https://upload.wikimedia.org/wikipedia/commons/7/7e/Circle-icons-profile.svg'); /* Example user icon */
            background-size: cover;
            background-position: center;
            color: #ffffff;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.3s ease;
        }

        .user-button:hover {
            background-color: #1e40af;
            transform: scale(1.1);
        }

        .mr-2 {
            height: 1.5rem;
            object-fit: contain;
            border: 1px solid #ffffff;
            border-radius: 10%; /* Adjust the percentage to get the desired roundness */
            overflow: hidden; /* Ensure the border follows the shape of the image */
        }

        .overlay {
            opacity: 0;
            pointer-events: none;

            position: fixed;
        
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;


            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(5px);
            z-index: 100;
            justify-content: center;
            align-items: center;

            transition: opacity 0.3s ease;
        }
        .overlay .box {
            background-color: #ffffff;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            width: 90%;
            max-width: 500px;
        }
        .overlay .box h2 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }
        .overlay .box ul {
            text-align: left;
            margin-bottom: 1rem;
        }
        .overlay .box ul li {
            margin-bottom: 0.5rem;
        }
        .overlay .box .total {
            font-weight: bold;
            margin-bottom: 1rem;
        }
        .overlay .box .checkout {
            background-color: #10b981;
            color: #ffffff;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            cursor: pointer;
            margin-bottom: 1rem;
            transition: background-color 0.3s ease;
        }
        .overlay .box .checkout:hover {
            background-color: #059669;
        }
        .overlay .box .back {
            color: #6b7280;
            cursor: pointer;
            margin-bottom: 1rem;
            transition: text-decoration 0.3s ease;
        }
        .overlay .box .back:hover {
            text-decoration: underline;
        }
        .overlay .box .payment-methods img {
            margin: 0 0.5rem;
            padding: 0.5rem;
            width: 3rem;
            height: 1.5rem;
            object-fit: contain;
            border-radius: 0.5rem;
            border: 1px solid #d1d5db;
            opacity: 1;

            transition: all 0.3s ease;
        }

        .overlay .box .payment-methods img:hover{
            opacity: 0.5;
        }

        .confirmation-overlay {
        opacity: 0;
            pointer-events:none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 200;
                }
                .confirmation-box {
                opacity:1;
                background: white;
                padding: 2rem;
                border-radius: 0.5rem;
                text-align: center;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .confirmation-box p {
                margin-bottom: 1rem;
                }
                .cancel-button {
                background: #f0f0f0;
                color: #333;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                cursor: pointer;
                margin-right: 1rem;
                transition: background-color 0.3s ease;
                }
                .cancel-button:hover {
                background: #e0e0e0;
                }
                .confirm-button {
                background: #a3e635;
                color: #333;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                cursor: pointer;
                transition: background-color 0.3s ease;
                }
                .confirm-button:hover {
                background: #8bc34a;
        }

        @media (max-width: 768px) {
            .content {
                text-align: center;
            }
            .title {
                margin-bottom: 0;
            }
            .cost-box {
                margin-top: 1rem;
                width: 100%;
                
            }
        }
        `

        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }
}