document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});


function compose_email() {
  //onclick
 
  document.querySelector('#button').onclick=()=>{
    const recipient=document.querySelector('#compose-recipients').value;
    const subject=document.querySelector('#compose-subject').value;
    const body=document.querySelector('#compose-body').value;
    fetch('/emails', {
  method: 'POST',
  body: JSON.stringify({
      recipients: recipient,
      subject: subject,
      body: body
  })
})
.then(response => response.json())
.then(result => {
    // Print result
    console.log(result);
    load_mailbox('sent');
  });
   
  };
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#mail-details').style.display = 'none';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
 
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-details').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
 fetch(`/emails/${mailbox}`)
.then(response => response.json())
.then(emails => {
    // Print emails
   
    emails.forEach(show_mail);

    // ... do something else with emails ...
});
}

function show_mail(contents){
  const mail=document.createElement('div');
  mail.className='mail';
  
  const sub=document.createElement('div');
  sub.className='sub';
  sub.innerHTML=`Subject : ${contents.subject}`; 
  mail.append(sub);

  const send=document.createElement('div');
  send.className='send';
  send.innerHTML=`From : ${contents.sender}`; 
  mail.append(send);

  const time=document.createElement('div');
  time.className='time';
  time.innerHTML=`${contents.timestamp}`; 
  mail.append(time);


  mail.addEventListener('click',function(){
               fetch(`/emails/${contents.id}`)
                  .then(response => response.json())
                  .then(email => {
                      // Print email
                      console.log(email);
                      mail_detail(email,document.querySelector('h3').innerHTML);

                      // ... do something else with email ...
          });
  })                
  if(contents.read){
    mail.style.background='grey';
  }
  document.querySelector('#emails-view').append(mail);
}
 
 
function mail_detail(mail,tag){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-details').style.display = 'block';
  document.querySelector('#mail-details').innerHTML='';
    fetch(`/emails/${mail.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          read : true
                          })
            })
       const timestamp=document.createElement('div');
      timestamp.className='timestamp';
      timestamp.innerHTML=`${mail.timestamp}`
      document.querySelector("#mail-details").append(timestamp);

      const sender=document.createElement('div');
      sender.className='sender';
      sender.innerHTML=`<strong>From</strong> : ${mail.sender}`
      document.querySelector("#mail-details").append(sender);

      const recipient=document.createElement('div');
      recipient.className='recipient';
      recipient.innerHTML=`<strong>To</strong> : ${mail.recipients}`
      document.querySelector("#mail-details").append(recipient);

      const subject=document.createElement('div');
      subject.className='subject';
      subject.innerHTML=`<strong>Subject</strong> : ${mail.subject}`
      document.querySelector("#mail-details").append(subject);

      const body=document.createElement('div');
      body.className='body';
      body.innerHTML=`${mail.body}`
      document.querySelector("#mail-details").append(body);

     


  if(tag==="Inbox"){
    const add_arch=document.createElement('button');
    add_arch.className='btn btn-sm btn-outline-primary';
    add_arch.innerHTML='Add to archive';
   add_arch.style.marginTop='20px';
   add_arch.style.marginRight='10px';
   
    add_arch.onclick=()=>{
      fetch(`/emails/${mail.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: true
              })
            })
      alert("added to archive");
      load_mailbox('inbox');

            };
     document.querySelector('#mail-details').append(add_arch);          
    }
  else if(tag==="Archive"){
    const remove_arch=document.createElement('button');
    remove_arch.className='btn btn-sm btn-outline-primary';
    remove_arch.style.marginTop='20px';
    remove_arch.style.marginRight='10px';
    remove_arch.innerHTML='remove from archive';
   
    remove_arch.onclick=()=>{
      fetch(`/emails/${mail.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: false
              })
            })
      alert("removed from archive");
      load_mailbox('archive');

         };
     document.querySelector('#mail-details').append(remove_arch);          
     
    }
    if(tag==="Inbox"||tag==="Archive"){
      const reply=document.createElement('button');
      reply.innerHTML='reply';
      reply.style.marginTop='20px';
      reply.className='btn btn-sm btn-outline-primary';
      document.querySelector('#mail-details').append(reply);
      reply.onclick=()=>{
         reply_mail(mail);{
       
       }
    }            

   }
}
  function reply_mail(mail){
    document.querySelector('#button').onclick=()=>{
        const recipient=document.querySelector('#compose-recipients').value;
        const subject=document.querySelector('#compose-subject').value;
        const body=document.querySelector('#compose-body').value;
          fetch('/emails', {
        method: 'POST',
        body: JSON.stringify({
            recipients: recipient,
            subject: subject,
            body: body
        })
      })
        .then(response => response.json())
        .then(result => {
            // Print result
            console.log(result);
            load_mailbox('sent');
          });
   
      };
      // Show compose view and hide other views
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'block';
      document.querySelector('#mail-details').style.display = 'none';
      // Clear out composition fields
      document.querySelector('#compose-recipients').value = `${mail.sender}`;
      document.querySelector('#compose-body').value = `On ${mail.timestamp} ${mail.sender} wrote ${mail.body}`;
      var str = mail.subject.toString();
      str=str.substring(0,4);
      if(str === 'Re :'){
          document.querySelector('#compose-subject').value=`${mail.subject}`;
          }
      else{
          document.querySelector('#compose-subject').value=`Re :${mail.subject}`;
          }
       };
