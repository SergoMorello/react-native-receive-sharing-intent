package com.reactnativereceivesharingintent;

import android.app.Application;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.provider.OpenableColumns;

import androidx.annotation.RequiresApi;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Objects;

import android.util.Base64;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import com.facebook.react.bridge.ReactApplicationContext;
import java.io.InputStream;

public class ReceiveSharingIntentHelper {

  private Context context;
  private ReactApplicationContext reactContext;

  public ReceiveSharingIntentHelper(ReactApplicationContext reactContext){

    this.context = reactContext.getApplicationContext();
	this.reactContext = reactContext;
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  public void sendFileNames(Context context, Intent intent, Promise promise){
    try {
      String action = intent.getAction();
      String type = intent.getType();
      if(type == null) { return; }
      if(!type.startsWith("text") && (Objects.equals(action, Intent.ACTION_SEND) || Objects.equals(action, Intent.ACTION_SEND_MULTIPLE))){
        WritableMap files = getMediaUris(intent,context);
        if(files == null) return;
        promise.resolve(files);
      }else if(type.startsWith("text") && Objects.equals(action, Intent.ACTION_SEND)){
        String text = null;
        String subject = null;
        try{
          text = intent.getStringExtra(Intent.EXTRA_TEXT);
          subject = intent.getStringExtra(Intent.EXTRA_SUBJECT);
        }catch (Exception ignored){ }
        if(text == null){
          WritableMap files = getMediaUris(intent,context);
          if(files == null) return;
          promise.resolve(files);
        }else{
          WritableMap files = new WritableNativeMap();
          WritableMap file = new WritableNativeMap();
          file.putString("contentUri",null);
          file.putString("filePath", null);
          file.putString("fileName", null);
          file.putString("extension", null);
          if(text.startsWith("http")){
            file.putString("weblink", text);
            file.putString("text",null);
          }else{
            file.putString("weblink", null);
            file.putString("text",text);
          }
          file.putString("subject", subject);
          files.putMap("0",file);
          promise.resolve(files);
        }

      }else if(Objects.equals(action, Intent.ACTION_VIEW)){
        String link = intent.getDataString();
        WritableMap files = new WritableNativeMap();
        WritableMap file = new WritableNativeMap();
        file.putString("contentUri",null);
        file.putString("filePath", null);
        file.putString("mimeType",null);
        file.putString("text",null);
        file.putString("weblink", link);
        file.putString("fileName", null);
        file.putString("extension", null);
        files.putMap("0",file);
        promise.resolve(files);
      }
      else if (Objects.equals(action, "android.intent.action.PROCESS_TEXT")) {
        String text = null;
        try {
          text = intent.getStringExtra(intent.EXTRA_PROCESS_TEXT);
        } catch (Exception e) {
        }
          WritableMap files = new WritableNativeMap();
          WritableMap file = new WritableNativeMap();
          file.putString("contentUri", null);
          file.putString("filePath", null);
          file.putString("fileName", null);
          file.putString("extension", null);
          file.putString("weblink", null);
          file.putString("text", text);
          files.putMap("0", file);
          promise.resolve(files);
      }else{
        promise.reject("error","Invalid file type.");
      }
    }catch (Exception e){
      promise.reject("error",e.toString());
    }
  };


  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  public WritableMap getMediaUris(Intent intent, Context context){
    if (intent == null) return null;

    String subject = null;
    try{
      subject = intent.getStringExtra(Intent.EXTRA_SUBJECT);
    }catch (Exception ignored){ }

    WritableMap files = new WritableNativeMap();
    if(Objects.equals(intent.getAction(), Intent.ACTION_SEND)){
      WritableMap file = new WritableNativeMap();
      Uri contentUri = (Uri) intent.getParcelableExtra(Intent.EXTRA_STREAM);
      if(contentUri == null) return null;
      String filePath = FileDirectory.INSTANCE.getAbsolutePath(context, contentUri);
      ContentResolver contentResolver = context.getContentResolver();
      file.putString("mimeType", contentResolver.getType(contentUri));
      Cursor queryResult = contentResolver.query(contentUri, null, null, null, null);
      queryResult.moveToFirst();
      file.putString("fileName", queryResult.getString(queryResult.getColumnIndex(OpenableColumns.DISPLAY_NAME)));
      file.putString("filePath", filePath);
      file.putString("contentUri",contentUri.toString());
      file.putString("text",null);
      file.putString("weblink", null);
      file.putString("subject", subject);
	  file.putString("base64", this.getBase64String(contentUri));
      files.putMap("0",file);
    }else if(Objects.equals(intent.getAction(), Intent.ACTION_SEND_MULTIPLE)) {
      ArrayList<Uri> contentUris = intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM);
      if (contentUris != null) {
        int index = 0;
        for (Uri uri : contentUris) {
          WritableMap file = new WritableNativeMap();
          ContentResolver contentResolver = context.getContentResolver();
          String filePath = FileDirectory.INSTANCE.getAbsolutePath(context, uri);
          // Based on https://developer.android.com/training/secure-file-sharing/retrieve-info
          file.putString("mimeType", contentResolver.getType(uri));
          Cursor queryResult = contentResolver.query(uri, null, null, null, null);
          queryResult.moveToFirst();
          file.putString("fileName", queryResult.getString(queryResult.getColumnIndex(OpenableColumns.DISPLAY_NAME)));
          file.putString("filePath", filePath);
          file.putString("contentUri",uri.toString());
          file.putString("text",null);
          file.putString("weblink", null);
          file.putString("subject", subject);
		  file.putString("base64", this.getBase64String(uri));
          files.putMap(Integer.toString(index),file);
          index++;
        }
      }
    }
    return  files;
  }

	private String getBase64String(Uri uri) {
        try (InputStream inputStream = this.reactContext.getContentResolver().openInputStream(uri);
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            byte[] bytes;
            byte[] buffer = new byte[8192];
            int bytesRead;

            while ((bytesRead = inputStream.read(buffer)) != -1) {
                output.write(buffer, 0, bytesRead);
            }
            bytes = output.toByteArray();
            return Base64.encodeToString(bytes, Base64.NO_WRAP);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

  private String getMediaType(String url){
    String mimeType = URLConnection.guessContentTypeFromName(url);
    return mimeType;
  }


  public void clearFileNames(Intent intent){
    String type = intent.getType();
    if(type == null) return;
    if (type.startsWith("text")) {
      intent.removeExtra(Intent.EXTRA_TEXT);
    } else if (type.startsWith("image") || type.startsWith("video") || type.startsWith("application")) {
      intent.removeExtra(Intent.EXTRA_STREAM);
    }
  }

  public String getFileName(String file){
    return  file.substring(file.lastIndexOf('/') + 1);
  }

  public String getExtension(String file){
    return file.substring(file.lastIndexOf('.') + 1);
  }

}
