<%@ WebHandler Language="C#" Class="FileUpload" %>

using System;
using System.Web;
using System.Web.SessionState;

public class FileUpload : IHttpHandler, IRequiresSessionState {
    HttpContext context;
    HttpSessionState session;
    public void ProcessRequest (HttpContext con) {
        context = con;
        session = context.Session;
        context.Response.ContentType = "text/plain";
        String RowsId = context.Request.Headers["X-Rows-Id"];
        String FileName = context.Request.Headers["X-File-Name"];
        String UsersId = session["UsersID"].ToString();
        if (context.Request.QueryString["IsDataUrl"] != null)
        {
        }
        else{
            byte[] FileBytes = new byte[context.Request.ContentLength];
            context.Request.InputStream.Read(FileBytes, 0, context.Request.ContentLength);
            context.Response.Write(SaveFile(FileBytes, UsersId + "_" + FileName));            
        }
    }

    private String SaveFile(byte[] fileBytes, String fileName)
    {
        String path = context.Server.MapPath("~/Blog/Uploads/Temp");
        path += "/"+fileName;
        System.IO.File.WriteAllBytes(path, fileBytes);
        return path;
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }
}